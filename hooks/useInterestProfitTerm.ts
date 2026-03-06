import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';

/**
 * Returns display terminology based on organization type:
 * - Conventional Banking → "Interest" / "Interest Rate" / "Interest Amount" / etc.
 * - Ethical Banking → "Profit" / "Profit Rate" / "Profit Amount" / etc.
 */
export function useInterestProfitTerm() {
  const { organizationType } = useOrganizationSettings();
  const isConventional = organizationType === 'Conventional Banking';

  return {
    /** lowercase: 'interest' | 'profit' */
    term: isConventional ? 'interest' : 'profit',
    /** Capitalized: 'Interest' | 'Profit' */
    termCapitalized: isConventional ? 'Interest' : 'Profit',
    /** "Interest Rate" | "Profit Rate" */
    rateLabel: isConventional ? 'Interest Rate' : 'Profit Rate',
    /** "Interest Amount" | "Profit Amount" */
    amountLabel: isConventional ? 'Interest Amount' : 'Profit Amount',
    /** "Interest Earned" | "Profit Earned" */
    earnedLabel: isConventional ? 'Interest Earned' : 'Profit Earned',
    /** "Default Interest Rate" | "Default Profit Rate" */
    defaultRateLabel: isConventional ? 'Default Interest Rate' : 'Default Profit Rate',
    /** "Loan Amount & Interest" | "Loan Amount & Profit" */
    loanAmountSectionTitle: isConventional ? 'Loan Amount & Interest' : 'Loan Amount & Profit',
    /** "% p.a." label context: "Interest" | "Profit" */
    ratePerAnnumLabel: isConventional ? 'Interest' : 'Profit',
    /** "Min Interest Rate" | "Min Profit Rate" (and Max) */
    minRateLabel: isConventional ? 'Min Interest Rate' : 'Min Profit Rate',
    maxRateLabel: isConventional ? 'Max Interest Rate' : 'Max Profit Rate',
    /** "Interest Income" | "Profit Income" (for charts of accounts, P&L) */
    incomeLabel: isConventional ? 'Interest Income' : 'Profit Income',
    /** "Interest Fee Income" | "Profit Fee Income" */
    feeIncomeLabel: isConventional ? 'Interest Fee Income' : 'Profit Fee Income',
    /** "Net Interest" | "Net Profit" (e.g. P&L summary) */
    netLabel: isConventional ? 'Net Interest' : 'Net Profit',
    /** "Revenue earned this period" style: "Interest earned..." | "Profit earned..." */
    revenueEarnedDescription: isConventional ? 'Interest earned this period' : 'Profit earned this period',
  };
}
