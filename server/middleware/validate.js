const Joi = require('joi');

const leadSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    company: Joi.string().allow('').optional(),
    phone: Joi.string().allow('').optional(),
    value: Joi.number().min(0).optional(),
    status: Joi.string().valid('New', 'Contacted', 'Negotiation', 'Won', 'Lost').optional(),
    source: Joi.string().optional(),
    assigned: Joi.string().optional(),
    help: Joi.string().optional(),
    website: Joi.string().uri().allow('').optional()
}); 

const validateLead = (req, res, next) => {
    // FIX: stripUnknown: true allows fields like createdAt/updatedAt to exist without crashing validation
    const { error, value } = leadSchema.validate(req.body, { stripUnknown: true });
    
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    // Replace req.body with the clean data
    req.body = value;
    next();
};

module.exports = { validateLead };