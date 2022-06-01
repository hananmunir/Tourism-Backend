import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const payment = (req, res) => {
  const { totalAmount, token } = req.body;
  stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create({
        amount: totalAmount,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
      });
    })
    .then((result) => res.status(200).send(result))
    .catch((error) => console.error(error));
};
