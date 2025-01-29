To create a Universal Rewards Token (URT) algorithm that normalizes reward points from multiple businesses into a single universal token, we need to consider several factors. One of the key factors is the "tier" of a company, which we will denote as \( T \). The tier of a company can depend on various factors such as sales, customer engagement, and the volume of points issued and redeemed.

### Step 1: Define the Tier (\( T \)) of a Company

The tier \( T \) of a company can be calculated using a formula that takes into account the total amount of points issued by the business, the total points redeemed by users, and possibly other factors like sales revenue or customer retention rates. 

Let’s define the following variables:

- \( P_{\text{issued}} \): Total points issued by the business.
- \( P_{\text{redeemed}} \): Total points redeemed by users from the business.
- \( S \): Total sales revenue of the business (optional, can be included if needed).
- \( \alpha \): A weighting factor for issued points (e.g., 0.5).
- \( \beta \): A weighting factor for redeemed points (e.g., 0.5).

The tier \( T \) of a company can be calculated as:

\[
T = \alpha \cdot \left(\frac{P_{\text{redeemed}}}{P_{\text{issued}}}\right) + \beta \cdot \left(\frac{S}{\text{max}(S)}\right)
\]

Here, \( \text{max}(S) \) is the maximum sales revenue across all businesses in the system. This ensures that the sales component is normalized.

### Step 2: Normalize Reward Points into Universal Reward Tokens (URTs)

Once the tier \( T \) of a company is determined, we can use it to normalize the reward points into URTs. The idea is that businesses with higher tiers will have their points converted into URTs at a more favorable rate.

Let’s define: