export enum RaffleStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DRAWN = 'DRAWN',
}

export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED', // In cart
  SOLD = 'SOLD',
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Ticket {
  id: string;
  number: number;
  status: TicketStatus;
  raffleId: string;
  userId?: string; // If sold
  purchaseId?: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pricePerTicket: number;
  totalTickets: number;
  status: RaffleStatus;
  createdAt: string;
  drawDate?: string;
  winnerTicketId?: string;
  winnerUserId?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  raffleId: string;
  ticketIds: string[];
  totalAmount: number;
  createdAt: string;
}

// Stats interface for Admin Dashboard
export interface DashboardStats {
  totalRevenue: number;
  activeRaffles: number;
  ticketsSold: number;
  totalUsers: number;
}