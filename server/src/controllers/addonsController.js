const AddOns = require("../models/Addons");

// Lấy tất cả AddOns
const getAllAddOns = async (req, res) => {
  try {
    const addons = await AddOns.find();
    res.status(200).json(addons);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách dịch vụ bổ sung." });
  }
};

// Thêm mới một AddOn
const createAddOn = async (req, res) => {
  try {
    const { name, description, price, type } = req.body;
    const addon = new AddOns({ name, description, price, type });
    await addon.save();
    res.status(201).json(addon);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Không thể tạo dịch vụ bổ sung.", error: err.message });
  }
};

// Xóa một AddOn
const deleteAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    await AddOns.findByIdAndDelete(id);
    res.status(200).json({ message: "Đã xóa dịch vụ bổ sung." });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Không thể xóa dịch vụ bổ sung.", error: err.message });
  }
};
module.exports = {
  getAllAddOns,
  createAddOn,
  deleteAddOn,
};
