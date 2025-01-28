import { depositPlanTypes, ERROR_MESSAGES } from "../src/constants";
import { determineDepositAllocation } from "../src/services";
import { depositPlans } from "../src/types/depositPlans";

describe("Determine deposit allocations function (Errors)", () => {
  it("Should throw error if deposit plans length is not within range (1 to 2) #1", () => {
    const depositPlans: depositPlans[] = [];
    const deposits = [400];
    expect(() => determineDepositAllocation(depositPlans, deposits)).toThrow(
      ERROR_MESSAGES.VALIDATION.DEPOSIT_PLANS
    );
  });

  it("Should throw error if deposit plans length is not within range (1 to 2) #2", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 1000,
          },
          {
            portfolioId: 2,
            amount: 500,
          },
        ],
      },
      {
        depositPlanId: 2,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 1000,
          },
          {
            portfolioId: 2,
            amount: 500,
          },
        ],
      },
      {
        depositPlanId: 3,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 1000,
          },
          {
            portfolioId: 2,
            amount: 500,
          },
        ],
      },
    ];
    const deposits = [400];
    expect(() => determineDepositAllocation(depositPlans, deposits)).toThrow(
      ERROR_MESSAGES.VALIDATION.DEPOSIT_PLANS
    );
  });

  it("Should throw error if deposits length is zero", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 1000,
          },
          {
            portfolioId: 2,
            amount: 500,
          },
        ],
      },
    ];
    const deposits: number[] = [];
    expect(() => determineDepositAllocation(depositPlans, deposits)).toThrow(
      ERROR_MESSAGES.VALIDATION.DEPOSITS
    );
  });
});
