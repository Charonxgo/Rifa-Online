import { Raffle, RaffleStatus, User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Cliente Demo',
    email: 'cliente@exemplo.com',
    isAdmin: false,
  },
  {
    id: 'admin-1',
    name: 'Administrador',
    email: 'admin@rifamaster.com',
    isAdmin: true,
  },
];

export const INITIAL_RAFFLES: Raffle[] = [
  {
    id: 'raffle-1',
    title: 'iPhone 15 Pro Max',
    description: 'Concorra ao smartphone mais desejado do ano! iPhone 15 Pro Max de 256GB na cor Titânio Natural.',
    imageUrl: 'https://picsum.photos/id/1/800/600',
    pricePerTicket: 15.00,
    totalTickets: 100,
    status: RaffleStatus.ACTIVE,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'raffle-2',
    title: 'Pix de R$ 5.000,00',
    description: 'Dinheiro na conta na hora! Participe e concorra a um PIX de 5 mil reais.',
    imageUrl: 'https://picsum.photos/id/445/800/600',
    pricePerTicket: 0.50,
    totalTickets: 500,
    status: RaffleStatus.ACTIVE,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'raffle-3',
    title: 'PlayStation 5',
    description: 'Console PlayStation 5 com leitor de disco + 2 jogos.',
    imageUrl: 'https://picsum.photos/id/96/800/600',
    pricePerTicket: 10.00,
    totalTickets: 200,
    status: RaffleStatus.CLOSED,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];