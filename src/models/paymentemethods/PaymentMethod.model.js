import PaymentMethodSchema from "./PaymentMethod.schema.js";

export const insertPaymentMethod = (obj) => {
  return PaymentMethodSchema(obj).save();
};

export const getAPaymentMethod = (filter) => {
  return PaymentMethodSchema.findOne(filter);
};
export const getAllPaymentMethod = () => {
  return PaymentMethodSchema.find();
};
export const getPaymentMethods = (filter) => {
  return PaymentMethodSchema.find(filter);
};

export const deletePaymentMethodById = (_id) => {
  return PaymentMethodSchema.findByIdAndDelete(_id);
};
//@updateObj must be an type of object
export const updatePaymentMethodById = (_id, updateObj) => {
  return PaymentMethodSchema.findByIdAndUpdate(_id, updateObj, { new: true });
};
