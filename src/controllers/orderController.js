//import priceWithDiscount from "../../../client/src/utils/priceWithDiscount.js";
import Stripe from "../config/stripe.js";
import cartProductModel from "../models/cartProductModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export async function cashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "PAGO CONTRA ENTREGA",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generatedOrder = await orderModel.insertMany(payload);

    ///remove from the cart
    const removeCartItems = await cartProductModel.deleteMany({
      userId: userId,
    });
    const updateInUser = await userModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return res.json({
      msg: "Orden  ",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

const priceWithDiscount = (price, dis = 1) => {
    const discountAmount = Math.round((Number(price) * Number(dis)) / 100);
    const actualPrice = Math.round(Number(price) - discountAmount);
    return actualPrice;
};

export default priceWithDiscount;

export async function paymentController(req, res) {
  try {
    const userId = req.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const user = await userModel.findById(userId);

    const line_items = list_items.map((item) => {
      return {
        price_data: {
          currency: "clp",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount:
            priceWithDiscount(item.productId.price, item.productId.discount) *
            100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const paylod = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(paylod);
    }
  }

  return productList;
};

//http://localhost:4000/api/order/webhook
export async function webhookStripe(req, res) {
  const event = req.body;
  const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata.userId;
      const orderProduct = await getOrderProductItems({
        lineItems: lineItems,
        userId: userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      const order = await orderModel.insertMany(orderProduct);

      if (Boolean(order[0])) {
        const removeCartItems = await userModel.findByIdAndUpdate(userId, {
          shopping_cart: [],
        });
        const removeCartProductDB = await cartProductModel.deleteMany({
          userId: userId,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
}

export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId; // order id

    const orderlist = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      msg: "Lista de pedidos",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}
