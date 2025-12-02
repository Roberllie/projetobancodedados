import 'reflect-metadata';
import express from 'express';
import { PartnerController } from './controllers/PartnerController';

const app = express();
app.use(express.json());

const partnerController = new PartnerController();

// Rotas definidas no desafio
app.post('/partners', (req, res) => partnerController.create(req, res));
app.get('/partners/:id', (req, res) => partnerController.getById(req, res));
app.get('/partners', (req, res) => partnerController.searchNearest(req, res));

export { app };
