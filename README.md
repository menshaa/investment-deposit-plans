## Description

Stashaway deposit plan Solution.

## Setup

1. Run `npm install` to install packages
2. Run `npm run test` to run tests

## Business Logic

### Validation

- A customer must have 1 or 2 deposit plans.
- A customer must at least one portfolio in each deposit plan.
- A customer must make at least one deposit for the allocation to take place.

### Portfolio Funds Allocation

The allocation of a deposit to a deposit plan's portfolios depends on the relationship between the deposit amount and the total planned amount for the portfolios. Below are the allocation rules and examples:

#### 1. Full Allocation

- A deposit is **fully allocated** to the portfolios if the deposit amount is equal to the total amount of the deposit plan.

**Example:**

- Deposit amount: **RM1000**
- Deposit plan:
  - Portfolio A: **RM700**
  - Portfolio B: **RM300**

In this case, both **Portfolio A** and **Portfolio B** will receive the full amount as planned:

- **Portfolio A** receives RM700
- **Portfolio B** receives RM300
- The entire deposit amount of RM1000 is fully utilized.

#### 2. Proportional Allocation

- If the deposit amount does **not** equal the total planned amount for the deposit plan, the deposit is allocated **proportionally** based on the planned amounts for each portfolio.

**Example:**

- Deposit amount: **RM1000**
- Deposit plan:
  - Portfolio A: **RM3000**
  - Portfolio B: **RM1000**

In this case, the total deposit amount is **RM1000**, and the sum of the portfolio amounts is **RM4000** (RM3000 for Portfolio A + RM1000 for Portfolio B). The allocation is proportional to the planned amounts:

- **Portfolio A** will receive: `RM1000 * (RM3000 / RM4000) = RM750`
- **Portfolio B** will receive: `RM1000 * (RM1000 / RM4000) = RM250`

This ensures that the deposit is allocated in proportion to the planned amounts for each portfolio, making the total allocated amount equal to the deposit amount.

#### 3. Edge Cases

1. Handling Zero Deposit Plan's Total Amount
   If a deposit plan's total amount is **zero**, the deposit will be fully allocated to the portfolios equally.

**Example:**

- Deposit amount: **RM900**
- Deposit plan:
  - Portfolio A: **RM0**
  - Portfolio B: **RM0**
  - Portfolio C: **RM0**

In this case, each portfolio will receive **RM300**:

- **Portfolio A** receives RM300
- **Portfolio B** receives RM300
- **Portfolio C** receives RM300
- The entire deposit amount of RM900 is fully utilized.

2. Handling Excess Deposit
   If a deposit **exceeds** the total planned amount for the deposit plan, the **remainder** of the deposit will be treated as a separate deposit and allocated proportionally to the portfolios. This process continues until the entire deposit is fully utilized.

**Example:**

- Deposit amount: **RM1000**
- Deposit plan:
  - Portfolio A: **RM100**
  - Portfolio B: **RM100**

In this scenario, the total planned amount for the portfolios is **RM200** (RM100 for Portfolio A and RM100 for Portfolio B). Initially, both portfolios receive their planned allocation:

- **Portfolio A**: RM100
- **Portfolio B**: RM100

This leaves a **remainder of RM800** from the initial deposit. The remainder is treated as a new deposit and is allocated proportionally to the portfolios.
Thus, at the end of the remainder's allocation:

- **Portfolio A** receives: **RM500**
- **Portfolio B** receives: **RM500**

The deposit is now fully utilized.
