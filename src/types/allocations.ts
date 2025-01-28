export type depositPlanAndPortfolioAllocationObject = {
  [depositPlanKey: string]: {
    [portfolioKey: string]: {
      portfolioId: number;
      plannedAmount: number;
      allocatedAmount: number;
    };
  };
};
