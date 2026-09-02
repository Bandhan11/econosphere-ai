/**
 * EconoSphere AI - Econometric & Quantitative Economics Engine
 * Mathematical and statistical algorithms for micro, macro, and financial calculations.
 */

export interface DemandSupplyParams {
  baseDemandIntercept: number; // a
  demandSlope: number; // b
  baseSupplyIntercept: number; // c
  supplySlope: number; // d
  taxPerUnit: number; // t
  subsidyPerUnit: number; // s
  tariffPerUnit: number; // import tariff
  incomeShiftPercent: number; // % shift in consumer income
  populationShiftPercent: number; // % shift in population
  productionCostShiftPercent: number; // % shift in input costs
  technologyShiftPercent: number; // % improvement in technology
  weatherShockPercent: number; // % agricultural shock
  transportCostPerUnit: number; // freight & fuel cost
}

export interface DemandSupplyResult {
  equilibriumPrice: number;
  equilibriumQuantity: number;
  buyerPrice: number;
  sellerPrice: number;
  consumerSurplus: number;
  producerSurplus: number;
  taxRevenue: number;
  subsidyCost: number;
  deadweightLoss: number;
  priceElasticityDemand: number;
  priceElasticitySupply: number;
  demandCurvePoints: { price: number; quantity: number }[];
  supplyCurvePoints: { price: number; quantity: number }[];
  demandShiftExplanation: string;
  supplyShiftExplanation: string;
}

export function calculateDemandSupply(params: DemandSupplyParams): DemandSupplyResult {
  const {
    baseDemandIntercept,
    demandSlope,
    baseSupplyIntercept,
    supplySlope,
    taxPerUnit,
    subsidyPerUnit,
    tariffPerUnit,
    incomeShiftPercent,
    populationShiftPercent,
    productionCostShiftPercent,
    technologyShiftPercent,
    weatherShockPercent,
    transportCostPerUnit,
  } = params;

  // Demand curve shifts: Q_d = A - b*P
  // Income positive effect (normal good), population positive
  const demandShiftFactor = 1 + (incomeShiftPercent * 0.008) + (populationShiftPercent * 0.006);
  const effectiveDemandIntercept = Math.max(10, baseDemandIntercept * demandShiftFactor);

  // Supply curve shifts: Q_s = C + d*P
  // Tech shifts supply right (+), cost & weather shock & transport shift supply left (-)
  const supplyShiftFactor = 1 + (technologyShiftPercent * 0.008)
    - (productionCostShiftPercent * 0.007)
    - (weatherShockPercent * 0.009)
    - (transportCostPerUnit * 0.012);
  const effectiveSupplyIntercept = baseSupplyIntercept * Math.max(0.2, supplyShiftFactor);

  // Net wedge from policy: Tax + Tariff - Subsidy
  const netTaxWedge = Math.max(0, taxPerUnit + tariffPerUnit - subsidyPerUnit);
  const netSubsidyWedge = Math.max(0, subsidyPerUnit - (taxPerUnit + tariffPerUnit));

  // Solve for equilibrium:
  // Q_d(P_buyer) = Q_s(P_seller)
  // P_buyer = P_seller + netTaxWedge - netSubsidyWedge
  // effectiveDemandIntercept - b*(P_s + wedge) = effectiveSupplyIntercept + d*P_s
  // effectiveDemandIntercept - b*wedge - effectiveSupplyIntercept = (b + d)*P_s

  const b = Math.max(0.1, demandSlope);
  const d = Math.max(0.1, supplySlope);

  let sellerPrice = (effectiveDemandIntercept - (b * netTaxWedge) + (b * netSubsidyWedge) - effectiveSupplyIntercept) / (b + d);
  sellerPrice = Math.max(1, Number(sellerPrice.toFixed(2)));

  let buyerPrice = sellerPrice + netTaxWedge - netSubsidyWedge;
  buyerPrice = Math.max(1, Number(buyerPrice.toFixed(2)));

  let equilibriumQuantity = effectiveSupplyIntercept + (d * sellerPrice);
  equilibriumQuantity = Math.max(1, Number(equilibriumQuantity.toFixed(2)));

  const equilibriumPrice = Number(((buyerPrice + sellerPrice) / 2).toFixed(2));

  // Maximum willingness to pay: P when Q=0 => P_max = A / b
  const pMax = effectiveDemandIntercept / b;
  // Minimum willingness to accept: P when Q=0 => P_min = -C / d
  const pMin = Math.max(0, -effectiveSupplyIntercept / d);

  // Surpluses
  const consumerSurplus = Math.max(0, Number((0.5 * Math.max(0, pMax - buyerPrice) * equilibriumQuantity).toFixed(2)));
  const producerSurplus = Math.max(0, Number((0.5 * Math.max(0, sellerPrice - pMin) * equilibriumQuantity).toFixed(2)));

  // Tax revenue / Subsidy cost
  const taxRevenue = netTaxWedge > 0 ? Number((netTaxWedge * equilibriumQuantity).toFixed(2)) : 0;
  const subsidyCost = netSubsidyWedge > 0 ? Number((netSubsidyWedge * equilibriumQuantity).toFixed(2)) : 0;

  // No-tax theoretical quantity for Deadweight loss calculation
  const qFreeMarket = (effectiveDemandIntercept - effectiveSupplyIntercept) / (b + d);
  const deadweightLoss = (netTaxWedge > 0 || netSubsidyWedge > 0)
    ? Number((0.5 * Math.abs(qFreeMarket - equilibriumQuantity) * Math.max(netTaxWedge, netSubsidyWedge)).toFixed(2))
    : 0;

  // Point elasticities at equilibrium
  const priceElasticityDemand = Number((-b * (buyerPrice / equilibriumQuantity)).toFixed(2));
  const priceElasticitySupply = Number((d * (sellerPrice / equilibriumQuantity)).toFixed(2));

  // Generate curve plot points
  const priceRangeMax = Math.ceil(pMax * 1.15);
  const step = Math.max(1, Math.floor(priceRangeMax / 15));
  const demandCurvePoints: { price: number; quantity: number }[] = [];
  const supplyCurvePoints: { price: number; quantity: number }[] = [];

  for (let p = 0; p <= priceRangeMax; p += step) {
    const qD = Math.max(0, Number((effectiveDemandIntercept - (b * p)).toFixed(1)));
    const qS = Math.max(0, Number((effectiveSupplyIntercept + (d * p)).toFixed(1)));
    demandCurvePoints.push({ price: p, quantity: qD });
    supplyCurvePoints.push({ price: p, quantity: qS });
  }

  // Explanations
  const demandShiftExplanation =
    incomeShiftPercent !== 0 || populationShiftPercent !== 0
      ? `Demand shifted by ${((demandShiftFactor - 1) * 100).toFixed(1)}% due to income (${incomeShiftPercent > 0 ? "+" : ""}${incomeShiftPercent}%) and demographic changes.`
      : "Demand curve at baseline structural preference position.";

  const supplyShiftExplanation =
    technologyShiftPercent !== 0 || productionCostShiftPercent !== 0 || weatherShockPercent !== 0 || transportCostPerUnit !== 0
      ? `Supply shifted by ${((supplyShiftFactor - 1) * 100).toFixed(1)}% driven by input factor costs, weather conditions, and transport logistics.`
      : "Supply curve at baseline marginal cost structure.";

  return {
    equilibriumPrice,
    equilibriumQuantity,
    buyerPrice,
    sellerPrice,
    consumerSurplus,
    producerSurplus,
    taxRevenue,
    subsidyCost,
    deadweightLoss,
    priceElasticityDemand,
    priceElasticitySupply,
    demandCurvePoints,
    supplyCurvePoints,
    demandShiftExplanation,
    supplyShiftExplanation,
  };
}

/**
 * Solow-Swan Neoclassical Growth Model
 * Y = A * K^alpha * L^(1-alpha)
 * In intensive terms: y = A * k^alpha
 * Capital accumulation: Delta k = s * y - (n + g + delta) * k
 */
export function calculateSolowGrowth(params: {
  savingsRate: number; // s (e.g. 0.22)
  depreciationRate: number; // delta (e.g. 0.05)
  populationGrowthRate: number; // n (e.g. 0.015)
  techProgressRate: number; // g (e.g. 0.02)
  capitalShareAlpha: number; // alpha (e.g. 0.33)
  totalFactorProductivity: number; // A (e.g. 1.0)
  initialCapitalPerWorker: number; // k_0
  timeHorizonYears?: number;
}) {
  const {
    savingsRate: s,
    depreciationRate: delta,
    populationGrowthRate: n,
    techProgressRate: g,
    capitalShareAlpha: alpha,
    totalFactorProductivity: A,
    initialCapitalPerWorker: k0,
    timeHorizonYears = 30,
  } = params;

  // Steady state capital per effective worker: k* = (s * A / (n + g + delta))^(1 / (1 - alpha))
  const effectiveBreakEven = n + g + delta;
  const kSteadyState = Math.pow((s * A) / effectiveBreakEven, 1 / (1 - alpha));
  const ySteadyState = A * Math.pow(kSteadyState, alpha);
  const cSteadyState = (1 - s) * ySteadyState;
  const iSteadyState = s * ySteadyState;
  const goldenRuleSavingsRate = alpha; // s_gold = alpha

  // Trajectory simulation
  const trajectory: { year: number; capitalPerWorker: number; outputPerWorker: number; consumptionPerWorker: number; investmentPerWorker: number }[] = [];
  let currentK = k0;

  for (let year = 0; year <= timeHorizonYears; year++) {
    const y = A * Math.pow(Math.max(0.1, currentK), alpha);
    const inv = s * y;
    const cons = (1 - s) * y;
    trajectory.push({
      year,
      capitalPerWorker: Number(currentK.toFixed(2)),
      outputPerWorker: Number(y.toFixed(2)),
      consumptionPerWorker: Number(cons.toFixed(2)),
      investmentPerWorker: Number(inv.toFixed(2)),
    });

    // Delta k = s*f(k) - (n+g+delta)*k
    const deltaK = inv - (effectiveBreakEven * currentK);
    currentK = Math.max(0.1, currentK + deltaK);
  }

  return {
    kSteadyState: Number(kSteadyState.toFixed(2)),
    ySteadyState: Number(ySteadyState.toFixed(2)),
    cSteadyState: Number(cSteadyState.toFixed(2)),
    iSteadyState: Number(iSteadyState.toFixed(2)),
    goldenRuleSavingsRate: Number((goldenRuleSavingsRate * 100).toFixed(1)),
    isAboveGoldenRule: s > goldenRuleSavingsRate,
    trajectory,
  };
}

/**
 * IS-LM Macroeconomic Model
 * Goods market: Y = C(Y-T) + I(r) + G
 * Money market: M/P = L(Y, r)
 */
export function calculateISLM(params: {
  autonomousConsumption: number; // C0
  marginalPropensityConsume: number; // c (e.g. 0.75)
  autonomousInvestment: number; // I0
  interestSensitivityInvestment: number; // b
  governmentSpending: number; // G
  taxes: number; // T
  realMoneySupply: number; // M/P
  moneyDemandIncomeSensitivity: number; // k
  moneyDemandInterestSensitivity: number; // h
}) {
  const {
    autonomousConsumption: C0,
    marginalPropensityConsume: c,
    autonomousInvestment: I0,
    interestSensitivityInvestment: b,
    governmentSpending: G,
    taxes: T,
    realMoneySupply: MP,
    moneyDemandIncomeSensitivity: k,
    moneyDemandInterestSensitivity: h,
  } = params;

  // IS curve: Y = (C0 - c*T + I0 + G - b*r) / (1 - c)
  // LM curve: r = (k*Y - MP) / h => Y = (MP + h*r) / k
  // At equilibrium:
  // (1-c)*Y + b*r = C0 - c*T + I0 + G
  // k*Y - h*r = MP

  const A_is = C0 - (c * T) + I0 + G;
  const denom = (1 - c) * h + b * k;

  const equilibriumY = (A_is * h + b * MP) / denom;
  const equilibriumInterestRate = (k * A_is - (1 - c) * MP) / denom;

  // Multipliers
  const fiscalMultiplier = h / denom; // dY/dG
  const monetaryMultiplier = b / denom; // dY/d(M/P)

  return {
    equilibriumOutputY: Number(equilibriumY.toFixed(1)),
    equilibriumInterestRatePercent: Number((equilibriumInterestRate * 100).toFixed(2)),
    fiscalMultiplier: Number(fiscalMultiplier.toFixed(2)),
    monetaryMultiplier: Number(monetaryMultiplier.toFixed(2)),
  };
}

/**
 * Gini Index & Lorenz Curve Engine
 */
export function calculateLorenzAndGini(incomeDeciles: number[]): { gini: number; lorenzPoints: { populationPercent: number; incomePercent: number; equalityPercent: number }[] } {
  // Sort income
  const sorted = [...incomeDeciles].sort((a, b) => a - b);
  const totalIncome = sorted.reduce((sum, val) => sum + val, 0);
  const n = sorted.length;

  const lorenzPoints: { populationPercent: number; incomePercent: number; equalityPercent: number }[] = [
    { populationPercent: 0, incomePercent: 0, equalityPercent: 0 },
  ];

  let cumulativeIncome = 0;
  let areaUnderLorenz = 0;

  for (let i = 0; i < n; i++) {
    cumulativeIncome += sorted[i];
    const popPct = Math.round(((i + 1) / n) * 100);
    const incPct = Number(((cumulativeIncome / totalIncome) * 100).toFixed(2));
    lorenzPoints.push({
      populationPercent: popPct,
      incomePercent: incPct,
      equalityPercent: popPct,
    });

    // Trapezoidal rule for area under curve
    const prevInc = (cumulativeIncome - sorted[i]) / totalIncome;
    const currInc = cumulativeIncome / totalIncome;
    areaUnderLorenz += 0.5 * (prevInc + currInc) * (1 / n);
  }

  // Gini = 1 - 2 * Area
  const gini = Math.max(0, Math.min(1, Number((1 - 2 * areaUnderLorenz).toFixed(3))));

  return { gini, lorenzPoints };
}

/**
 * Linear Ordinary Least Squares (OLS) Regressor with Statistics
 */
export function runLinearRegression(xValues: number[], yValues: number[]): {
  slope: number;
  intercept: number;
  rSquared: number;
  correlation: number;
  stdError: number;
  tStat: number;
  pValueEstimated: number;
  equation: string;
} {
  const n = Math.min(xValues.length, yValues.length);
  if (n < 3) {
    return {
      slope: 0,
      intercept: 0,
      rSquared: 0,
      correlation: 0,
      stdError: 0,
      tStat: 0,
      pValueEstimated: 1,
      equation: "Y = 0 + 0 * X",
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += xValues[i];
    sumY += yValues[i];
    sumXY += xValues[i] * yValues[i];
    sumX2 += xValues[i] * xValues[i];
    sumY2 += yValues[i] * yValues[i];
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  const numerator = sumXY - (n * meanX * meanY);
  const denomX = sumX2 - (n * meanX * meanX);
  const denomY = sumY2 - (n * meanY * meanY);

  const slope = denomX !== 0 ? numerator / denomX : 0;
  const intercept = meanY - (slope * meanX);

  const correlation = (denomX > 0 && denomY > 0) ? numerator / Math.sqrt(denomX * denomY) : 0;
  const rSquared = Math.max(0, Math.min(1, correlation * correlation));

  // Residual variance and standard error of slope
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yHat = intercept + slope * xValues[i];
    ssRes += Math.pow(yValues[i] - yHat, 2);
  }
  const s2 = ssRes / Math.max(1, n - 2);
  const stdError = Math.sqrt(s2 / Math.max(0.0001, denomX));
  const tStat = stdError > 0 ? Math.abs(slope / stdError) : 0;

  // Approx two-tailed p-value from t-stat
  const pValueEstimated = tStat > 3.29 ? 0.001 : tStat > 2.58 ? 0.01 : tStat > 1.96 ? 0.05 : 0.25;

  const equation = `Y = ${intercept.toFixed(2)} ${slope >= 0 ? "+" : "-"} ${Math.abs(slope).toFixed(3)}·X`;

  return {
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    rSquared: Number(rSquared.toFixed(3)),
    correlation: Number(correlation.toFixed(3)),
    stdError: Number(stdError.toFixed(4)),
    tStat: Number(tStat.toFixed(2)),
    pValueEstimated,
    equation,
  };
}

/**
 * Holt-Winters / Double & Triple Exponential Smoothing Forecast
 */
export function holtWintersForecast(
  series: number[],
  periodsAhead: number = 4,
  p3: number = 4,
  p4: number = 0.4,
  p5: number = 0.2,
  p6: number = 0.1
): ForecastResult & Array<{ forecast: number; lower95: number; upper95: number }> {
  // Disambiguate parameters based on count
  let alpha = 0.4;
  let beta = 0.2;
  let gamma = 0.1;
  let period = 4;

  if (p6 !== undefined && p6 !== null) {
    period = p3;
    alpha = p4;
    beta = p5;
    gamma = p6;
  } else {
    alpha = p3;
    beta = p4;
    gamma = p5;
  }

  if (series.length < 2) {
    const empty: any = [];
    empty.forecastValues = [];
    empty.lowerConfidence95 = [];
    empty.upperConfidence95 = [];
    return empty;
  }

  let level = series[0];
  let trend = series[1] - series[0];

  const residuals: number[] = [];

  for (let i = 1; i < series.length; i++) {
    const prevLevel = level;
    const prevTrend = trend;
    const actual = series[i];

    const oneStepAhead = prevLevel + prevTrend;
    residuals.push(actual - oneStepAhead);

    level = alpha * actual + (1 - alpha) * (prevLevel + prevTrend);
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
  }

  // Calculate residual standard error
  const variance = residuals.reduce((sum, r) => sum + r * r, 0) / Math.max(1, residuals.length);
  const rmse = Math.sqrt(variance);

  const results: any = [];
  const forecastValues: number[] = [];
  const lowerConfidence95: number[] = [];
  const upperConfidence95: number[] = [];

  for (let h = 1; h <= periodsAhead; h++) {
    const pointForecast = Number((level + h * trend).toFixed(2));
    const intervalWidth = Number((1.96 * rmse * Math.sqrt(h)).toFixed(2));
    const lower = Number((pointForecast - intervalWidth).toFixed(2));
    const upper = Number((pointForecast + intervalWidth).toFixed(2));

    forecastValues.push(pointForecast);
    lowerConfidence95.push(lower);
    upperConfidence95.push(upper);

    results.push({
      forecast: pointForecast,
      lower95: lower,
      upper95: upper,
    });
  }

  results.forecastValues = forecastValues;
  results.lowerConfidence95 = lowerConfidence95;
  results.upperConfidence95 = upperConfidence95;

  return results;
}

export interface ForecastResult {
  forecastValues: number[];
  lowerConfidence95: number[];
  upperConfidence95: number[];
}

export type SolowParams = {
  savingsRate: number;
  depreciationRate: number;
  populationGrowthRate: number;
  techProgressRate: number;
  capitalShareAlpha: number;
  totalFactorProductivity: number;
  initialCapitalPerWorker: number;
  timeHorizonYears?: number;
};

export type ISLMParams = {
  autonomousConsumption: number;
  marginalPropensityConsume: number;
  autonomousInvestment: number;
  interestSensitivityInvestment: number;
  governmentSpending: number;
  taxes: number;
  realMoneySupply: number;
  moneyDemandIncomeSensitivity: number;
  moneyDemandInterestSensitivity: number;
};

export const calculateMarketEquilibrium = calculateDemandSupply;
export const simulateSolowGrowth = calculateSolowGrowth;

export interface RegressionResult {
  coefficients: number[];
  standardErrors: number[];
  tStatistics: number[];
  pValues: number[];
  rSquared: number;
  adjustedRSquared: number;
  fStatistic: number;
  standardErrorOfRegression: number;
  residuals: number[];
  fittedValues: number[];
}

export function runOLSRegression(y: number[], xMatrix: number[][]): RegressionResult {
  const n = y.length;
  const k = xMatrix[0]?.length || 0;

  // Simple multi-variable or single-variable OLS solver
  // Construct Design Matrix X with intercept column
  const X: number[][] = [];
  for (let i = 0; i < n; i++) {
    X.push([1, ...xMatrix[i]]);
  }

  // Transpose X
  const p = k + 1;
  const XT: number[][] = Array.from({ length: p }, () => Array(n).fill(0));
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < n; j++) {
      XT[i][j] = X[j][i];
    }
  }

  // Compute X^T * X (p x p matrix)
  const XTX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let m = 0; m < n; m++) {
        sum += XT[i][m] * X[m][j];
      }
      XTX[i][j] = sum;
    }
  }

  // Compute X^T * y (p x 1 vector)
  const XTy: number[] = Array(p).fill(0);
  for (let i = 0; i < p; i++) {
    let sum = 0;
    for (let m = 0; m < n; m++) {
      sum += XT[i][m] * y[m];
    }
    XTy[i] = sum;
  }

  // Invert XTX using Gauss-Jordan elimination
  const invXTX: number[][] = Array.from({ length: p }, (_, i) =>
    Array.from({ length: p }, (_, j) => (i === j ? 1 : 0))
  );
  const A = XTX.map((row) => [...row]);

  for (let i = 0; i < p; i++) {
    let pivot = A[i][i];
    if (Math.abs(pivot) < 1e-12) pivot = 1e-12;

    for (let j = 0; j < p; j++) {
      A[i][j] /= pivot;
      invXTX[i][j] /= pivot;
    }

    for (let r = 0; r < p; r++) {
      if (r !== i) {
        const factor = A[r][i];
        for (let c = 0; c < p; c++) {
          A[r][c] -= factor * A[i][c];
          invXTX[r][c] -= factor * invXTX[i][c];
        }
      }
    }
  }

  // Compute beta = (X^T X)^-1 * X^T y
  const beta: number[] = Array(p).fill(0);
  for (let i = 0; i < p; i++) {
    let sum = 0;
    for (let j = 0; j < p; j++) {
      sum += invXTX[i][j] * XTy[j];
    }
    beta[i] = Number(sum.toFixed(4));
  }

  // Fitted values and residuals
  const fittedValues: number[] = [];
  const residuals: number[] = [];
  let ssRes = 0;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let ssTot = 0;

  for (let i = 0; i < n; i++) {
    let yHat = 0;
    for (let j = 0; j < p; j++) {
      yHat += beta[j] * X[i][j];
    }
    fittedValues.push(Number(yHat.toFixed(3)));
    const res = y[i] - yHat;
    residuals.push(Number(res.toFixed(3)));
    ssRes += res * res;
    ssTot += Math.pow(y[i] - meanY, 2);
  }

  const df = Math.max(1, n - p);
  const s2 = ssRes / df;
  const seReg = Number(Math.sqrt(s2).toFixed(3));

  const standardErrors: number[] = [];
  const tStatistics: number[] = [];
  const pValues: number[] = [];

  for (let i = 0; i < p; i++) {
    const varBeta_i = Math.max(0, s2 * invXTX[i][i]);
    const se = Math.sqrt(varBeta_i);
    standardErrors.push(Number(se.toFixed(4)));
    const t = se > 0 ? Math.abs(beta[i] / se) : 0;
    tStatistics.push(Number(t.toFixed(2)));
    const pVal = t > 3.29 ? 0.001 : t > 2.58 ? 0.01 : t > 1.96 ? 0.05 : t > 1.64 ? 0.09 : 0.25;
    pValues.push(pVal);
  }

  const rSquared = ssTot > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 0;
  const adjR2 = Math.max(0, 1 - (1 - rSquared) * ((n - 1) / df));
  const fStat = k > 0 && ssRes > 0 ? ((ssTot - ssRes) / k) / (ssRes / df) : 0;

  return {
    coefficients: beta,
    standardErrors,
    tStatistics,
    pValues,
    rSquared: Number(rSquared.toFixed(3)),
    adjustedRSquared: Number(adjR2.toFixed(3)),
    fStatistic: Number(fStat.toFixed(2)),
    standardErrorOfRegression: seReg,
    residuals,
    fittedValues,
  };
}

/**
 * Descriptive Statistics Summary
 */
export function calculateDescriptiveStats(numbers: number[]): {
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  variance: number;
} {
  const valid = numbers.filter((n) => typeof n === "number" && !isNaN(n)).sort((a, b) => a - b);
  const count = valid.length;
  if (count === 0) {
    return { count: 0, mean: 0, median: 0, stdDev: 0, min: 0, max: 0, variance: 0 };
  }

  const sum = valid.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;
  const median = count % 2 === 0 ? (valid[count / 2 - 1] + valid[count / 2]) / 2 : valid[Math.floor(count / 2)];
  const min = valid[0];
  const max = valid[count - 1];

  const sqDiffs = valid.map((v) => Math.pow(v - mean, 2));
  const variance = sqDiffs.reduce((acc, v) => acc + v, 0) / Math.max(1, count - 1);
  const stdDev = Math.sqrt(variance);

  return {
    count,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    variance: Number(variance.toFixed(2)),
  };
}
