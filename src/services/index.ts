import { depositPlanTypes, ERROR_MESSAGES } from "../constants";
import { depositPlanAndPortfolioAllocationObject } from "../types/allocations";
import {
  depositPlanPortfolio,
  depositPlans,
  portfolioAllocations,
} from "../types/depositPlans";

export function determineDepositAllocation(
  depositPlans: depositPlans[] = [],
  deposits: number[] = []
): portfolioAllocations[] {
  // Ensuring there will always be at least 1 or 2 deposit plans.
  if (depositPlans?.length < 1 || depositPlans?.length > 2) {
    throw new Error(ERROR_MESSAGES.VALIDATION.DEPOSIT_PLANS);
  }

  // Ensuring there will always be at least 1 deposit.
  if (deposits?.length === 0) {
    throw new Error(ERROR_MESSAGES.VALIDATION.DEPOSITS);
  }

  // Ensuring one time deposit plans are processed first.
  depositPlans = _sortDepositPlansByType(depositPlans);

  let finalAllocations = {};
  for (const deposit of deposits) {
    // Maintaining another variable "remainderDeposit" to deduct allocated deposits from it.
    let remainderDeposit = deposit;
    const allocations = _calculateAllocations(
      finalAllocations,
      remainderDeposit,
      deposit,
      depositPlans
    );
    finalAllocations = { ...finalAllocations, ...allocations };
  }

  const portfoliosAllocatedAmounts =
    _sumPortfolioAllocatedAmounts(finalAllocations);

  return portfoliosAllocatedAmounts;
}

export function _sortDepositPlansByType(
  depositPlans: depositPlans[]
): depositPlans[] {
  if (depositPlans.length === 1) return depositPlans;

  const [firstDepositPlan, secondDepositPlan] = depositPlans;
  const { type: firstDepositPlanType } = firstDepositPlan;
  const { type: secondDepositPlanType } = secondDepositPlan;

  if (
    firstDepositPlanType !== depositPlanTypes.ONE_TIME &&
    secondDepositPlanType === depositPlanTypes.ONE_TIME
  ) {
    depositPlans = [secondDepositPlan, firstDepositPlan];
  }

  return depositPlans;
}

function _calculateDepositPlanTotalAmount(depositPlan: depositPlans) {
  return depositPlan.portfolios
    .map((portfolio) => portfolio.amount)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
}

function _preparePortfolioAllocationsObject(
  allocations: depositPlanAndPortfolioAllocationObject,
  portfolios: depositPlanPortfolio[],
  depositPlanId: number
): depositPlanAndPortfolioAllocationObject {
  /**
   * If below is present, it means all portfolios have been fully allocated, and the remainder of the deposit is now being allocated.
   * Therefore, there is no need to re-create the object as it's already been created earlier.
   */
  if (allocations[`deposit_plan_${depositPlanId}`]) {
    return allocations;
  }

  // Create allocation object to sum allocatedAmount for each portfolio within a deposit plan.
  return portfolios.reduce(
    (
      prev: depositPlanAndPortfolioAllocationObject,
      curr: depositPlanPortfolio
    ) => {
      const { portfolioId, amount } = curr;
      if (prev[`deposit_plan_${depositPlanId}`]) {
        prev[`deposit_plan_${depositPlanId}`][`portfolio_${portfolioId}`] = {
          portfolioId,
          plannedAmount: amount,
          allocatedAmount: 0,
        };
      } else {
        prev[`deposit_plan_${depositPlanId}`] = {
          [`portfolio_${portfolioId}`]: {
            portfolioId,
            plannedAmount: amount,
            allocatedAmount: 0,
          },
        };
      }

      return prev;
    },
    {}
  );
}

function _calculateAllocations(
  allocations: depositPlanAndPortfolioAllocationObject,
  remainderDeposit: number,
  deposit: number,
  depositPlans: depositPlans[],
  bypassDepositPlanFullyAllocatedCheck: boolean = false
): depositPlanAndPortfolioAllocationObject {
  /**
   * fullyAllocatedDepositPlansCount is maintained to count deposit plans that are fully allocated
   */
  let fullyAllocatedDepositPlansCount = 0;
  for (const depositPlan of depositPlans) {
    const { portfolios = [], depositPlanId } = depositPlan;
    if (portfolios.length === 0) {
      throw new Error(ERROR_MESSAGES.VALIDATION.PORTFOLIOS);
    }

    const defaultAllocations = _preparePortfolioAllocationsObject(
      allocations,
      depositPlan.portfolios,
      depositPlan.depositPlanId
    );

    const isDepositPlanFullyAllocated = _checkIfDepositPlanIsFullyAllocated(
      defaultAllocations,
      depositPlan.depositPlanId
    );

    // if bypassDepositPlanFullyAllocatedCheck is true, it means all deposit plans are fully allocated, we are now allocating excess deposit amounts.
    if (isDepositPlanFullyAllocated && !bypassDepositPlanFullyAllocatedCheck) {
      fullyAllocatedDepositPlansCount += 1;

      // if fullyAllocatedDepositPlansCount is equal to deposit plans, it means all deposit plans are fully allocated. In that case, we should bypass the below check and allow excess deposit to be allocated.
      if (fullyAllocatedDepositPlansCount === depositPlans.length) {
        break;
      } else {
        continue;
      }
    }

    let totalDepositPlanAmount = _calculateDepositPlanTotalAmount(depositPlan);
    let isDepositFullyUsed = false;
    let shouldUseFixedRatio = false;
    let fixedRatio = 1 / portfolios.length;

    // If totalDepositPlanAmount is 0, allocate the whole deposit to the deposit plan
    if (totalDepositPlanAmount === 0) {
      totalDepositPlanAmount = deposit;
      shouldUseFixedRatio = true;
    }

    for (const portfolio of portfolios) {
      const { amount, portfolioId } = portfolio;

      const ratio = shouldUseFixedRatio
        ? fixedRatio
        : amount / totalDepositPlanAmount;

      let allocatedAmount = shouldUseFixedRatio
        ? ratio * deposit
        : Math.min(ratio * deposit, amount);

      if (remainderDeposit < allocatedAmount) {
        allocatedAmount = remainderDeposit;
        remainderDeposit = 0;
        isDepositFullyUsed = true;
      }
      defaultAllocations[`deposit_plan_${depositPlanId}`][
        `portfolio_${portfolioId}`
      ].allocatedAmount += Number(allocatedAmount.toFixed(4));

      if (isDepositFullyUsed) {
        break;
      }

      remainderDeposit -= allocatedAmount;
    }

    allocations = { ...allocations, ...defaultAllocations };
  }

  if (fullyAllocatedDepositPlansCount === depositPlans.length) {
    allocations = _calculateAllocations(
      allocations,
      remainderDeposit,
      deposit,
      depositPlans,
      true
    );
  } else if (remainderDeposit > 0) {
    allocations = _calculateAllocations(
      allocations,
      remainderDeposit,
      remainderDeposit,
      depositPlans
    );
  }
  return allocations;
}

function _sumPortfolioAllocatedAmounts(
  allocations: depositPlanAndPortfolioAllocationObject
): portfolioAllocations[] {
  const portfoliosAllocatedAmounts: any = {};
  for (const depositPlanKey in allocations) {
    const depositPlan = allocations[depositPlanKey];

    for (const portfolioKey in depositPlan) {
      const { portfolioId, allocatedAmount } = depositPlan[portfolioKey];

      portfoliosAllocatedAmounts[portfolioId] =
        (portfoliosAllocatedAmounts[portfolioId] || 0) + allocatedAmount;
    }
  }

  // Converting object to an array
  return Object.entries(portfoliosAllocatedAmounts).map(
    ([portfolioId, amount]): any => ({
      portfolioId: Number(portfolioId),
      allocatedAmount: Number((amount as number).toFixed(4)),
    })
  );
}

function _checkIfDepositPlanIsFullyAllocated(
  defaultAllocations: depositPlanAndPortfolioAllocationObject,
  depositPlanId: number
): boolean {
  const targetAllocations = defaultAllocations[`deposit_plan_${depositPlanId}`];
  return Object.values(targetAllocations).every(
    (amounts) => amounts.plannedAmount === amounts.allocatedAmount
  );
}
