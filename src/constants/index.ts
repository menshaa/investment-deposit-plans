export enum depositPlanTypes {
  ONE_TIME = "one_time",
  MONTHLY = "monthly",
}
export const ERROR_MESSAGES = {
  VALIDATION: {
    DEPOSIT_PLANS: "You are only allowed to have 1 to 2 deposit plans.",
    DEPOSITS: "You must include at least one deposit.",
    PORTFOLIOS: "You must have at least one portfolio",
  },
};
