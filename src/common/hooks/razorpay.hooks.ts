// import Razorpay from 'razorpay';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_d6crT1yPFJVPKA',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'DK1sxh6mHCEYrdOdk9R3ByAv',
});

export const createRazorpayOrder = async (amount, uuid) => {
  return await instance.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: uuid,
  });
};

export const verifyPayment = async (
  razorpayOrderId,
  razorpayPaymentId,
  signature,
) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {
    validatePaymentVerification,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('razorpay/dist/utils/razorpay-utils');
  try {
    await validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      process.env.RAZORPAY_KEY_SECRET || 'DK1sxh6mHCEYrdOdk9R3ByAv',
    );
    return true;
  } catch (error) {
    return false;
  }
};
