import { depositPlanTypes } from "../src/constants";
import { determineDepositAllocation } from "../src/services";
import { depositPlans, portfolioAllocations } from "../src/types/depositPlans";

describe("Determine deposit allocations function (Single deposit plan)", () => {
  it("Should correctly allocate deposits to portfolios equally as deposit plans is spread equally to all portfolios", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 2,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 100,
          },
          {
            portfolioId: 2,
            amount: 100,
          },
        ],
      },
    ];
    const deposits = [400];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 200.0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 200.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits to portfolios in 1 to 10 ratio.", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.MONTHLY,
        portfolios: [
          {
            portfolioId: 1,
            amount: 900,
          },
          {
            portfolioId: 2,
            amount: 100,
          },
        ],
      },
    ];
    const deposits = [100];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 90.0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 10.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits fully to each portfolio as deposit is exactly equal to deposit plan total amount", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 900,
          },
          {
            portfolioId: 2,
            amount: 100,
          },
          {
            portfolioId: 3,
            amount: 500,
          },
        ],
      },
    ];
    const deposits = [1500];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 900.0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 100.0,
      },
      {
        portfolioId: 3,
        allocatedAmount: 500.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits to portfolios fully plus additional amount due to additional deposit", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 900.0,
          },
          {
            portfolioId: 2,
            amount: 100.0,
          },
          {
            portfolioId: 3,
            amount: 500.0,
          },
        ],
      },
    ];
    const deposits = [1500, 500];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 1200,
      },
      {
        portfolioId: 2,
        allocatedAmount: 133.3333,
      },
      {
        portfolioId: 3,
        allocatedAmount: 666.6667,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits to portfolio in case a deposit plan has duplicate portfolios.", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 900,
          },
          {
            portfolioId: 1,
            amount: 100,
          },
        ],
      },
    ];
    const deposits = [1000];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 1000.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits to portfolio even thought deposit plans are zero", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 0,
          },
        ],
      },
    ];
    const deposits = [1000];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 1000.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits to portfolio with planned amount", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 0,
          },
          {
            portfolioId: 2,
            amount: 1000,
          },
        ],
      },
    ];
    const deposits = [1000];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 0.0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 1000.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits to portfolio with planned amount, with multiple deposits", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 1,
        type: depositPlanTypes.ONE_TIME,
        portfolios: [
          {
            portfolioId: 1,
            amount: 0,
          },
          {
            portfolioId: 2,
            amount: 1000,
          },
        ],
      },
    ];
    const deposits = [500, 500];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 0.0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 1000.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });
});

describe("Determine deposit allocations function (Two deposit plans)", () => {
  it("Should correctly allocate deposits to portfolios equally as deposit plans is spread equally to all portfolios", () => {
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
        type: depositPlanTypes.MONTHLY,
        portfolios: [
          {
            portfolioId: 1,
            amount: 400,
          },
          {
            portfolioId: 2,
            amount: 200,
          },
        ],
      },
    ];
    const deposits = [2100];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 1400.0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 700.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits (2) to portfolios (one_time deposit is priority)", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 2,
        type: depositPlanTypes.MONTHLY,
        portfolios: [
          {
            portfolioId: 3,
            amount: 500,
          },
        ],
      },
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
    const deposits = [1500, 2000];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 2000.0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 1000.0,
      },
      {
        portfolioId: 3,
        allocatedAmount: 500.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should correctly allocate deposits (3) to portfolios (one_time deposit is priority)", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 2,
        type: depositPlanTypes.MONTHLY,
        portfolios: [
          {
            portfolioId: 3,
            amount: 500,
          },
        ],
      },
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
    const deposits = [1500, 2000, 500];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 2333.3333,
      },
      {
        portfolioId: 2,
        allocatedAmount: 1166.6667,
      },
      {
        portfolioId: 3,
        allocatedAmount: 500.0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });

  it("Should not allocate anything if deposits are zero", () => {
    const depositPlans: depositPlans[] = [
      {
        depositPlanId: 2,
        type: depositPlanTypes.MONTHLY,
        portfolios: [
          {
            portfolioId: 3,
            amount: 500,
          },
        ],
      },
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
    const deposits = [0, 0];
    const result = determineDepositAllocation(depositPlans, deposits);
    const expectedResult: portfolioAllocations[] = [
      {
        portfolioId: 1,
        allocatedAmount: 0,
      },
      {
        portfolioId: 2,
        allocatedAmount: 0,
      },
      {
        portfolioId: 3,
        allocatedAmount: 0,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });
});
