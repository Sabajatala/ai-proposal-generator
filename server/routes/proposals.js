const express = require('express');
const router = express.Router();
const { generateProposal, getProposals, getProposalById, updateProposalStatus, deleteProposal, updateProposal } = require('../controllers/proposalController');
const protect = require('../middleware/auth');

router.post('/generate', protect, generateProposal);
router.get('/', protect, getProposals);
router.get('/:id', protect, getProposalById);
router.patch('/:id/status', protect, updateProposalStatus);
router.delete('/:id', protect, deleteProposal);
router.put('/:id', protect, updateProposal);
module.exports = router;