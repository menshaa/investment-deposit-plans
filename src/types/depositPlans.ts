import { depositPlanTypes } from "../constants";

export type depositPlanPortfolio = {
  portfolioId: number;
  amount: number;
};

export type depositPlans = {
  depositPlanId: number;
  type: depositPlanTypes;
  portfolios: depositPlanPortfolio[];
};

export type portfolioAllocations = {
  portfolioId: number;
  allocatedAmount: number;
};
