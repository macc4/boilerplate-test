export enum PortfoliosEvents {
  PORTFOLIO_DELETED = 'PORTFOLIO_DELETED',
}

export class PortfolioDeletedEvent {
  portfolioId: number;
}
