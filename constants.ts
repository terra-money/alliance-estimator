export const TAKE_RATE_INTERVAL = 5
export const APP_TITLE = "Terra Staking Reward Estimator"
export const USE_MOCK_DATA = true
export const MOCK_DATA = {
  0: {
    name: "WHALELSD",
    inputValues: {
      lsdApr: 16,
      assetPrice: 0.015,
      allianceRewardWeight: 0.001,
      annualizedTakeRate: 16,
      assetStakedInAlliance: 10000000,
    },
  },
  1: {
    name: "KUJILSD",
    inputValues: {
      lsdApr: 16,
      assetPrice: 0.424,
      allianceRewardWeight: 0.01,
      annualizedTakeRate: 11,
      assetStakedInAlliance: 9000000,
    },
  },
  2: {
    name: "OSMOLSD",
    inputValues: {
      lsdApr: 22,
      assetPrice: 0.819,
      allianceRewardWeight: 0.04,
      annualizedTakeRate: 22,
      assetStakedInAlliance: 19000000,
    },
  },
}
