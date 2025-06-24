const BusinessPartner = require('../models/BussinessPartner');

// Lấy tất cả business partners (for admin)
async function getAllBusinessPartners(req, res) {
  try {
    const partners = await BusinessPartner.find()
      .populate('account_id', 'username email')
      .populate('services_type_id', 'service_name')
      .sort({ company_name: 1 });

    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching business partners:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể lấy danh sách đối tác'
    });
  }
}

// Lấy business partners cho car rental service
async function getCarRentalPartners(req, res) {
  try {
    // Lấy car rental service type
    const Service = require('../models/Service');
    const carRentalService = await Service.findOne({ 
      service_name: { $regex: /car.*rental/i } 
    });

    if (!carRentalService) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy dịch vụ cho thuê xe'
      });
    }

    const partners = await BusinessPartner.find({
      services_type_id: carRentalService._id
    })
      .select('_id company_name country states address phone rating review_count')
      .sort({ company_name: 1 });

    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching car rental partners:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể lấy danh sách đối tác cho thuê xe'
    });
  }
}

// Lấy business partner theo ID
async function getBusinessPartnerById(req, res) {
  try {
    const { id } = req.params;
    const partner = await BusinessPartner.findById(id)
      .populate('account_id', 'username email')
      .populate('services_type_id', 'service_name');

    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy đối tác'
      });
    }

    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Error fetching business partner:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể lấy thông tin đối tác'
    });
  }
}

module.exports = {
  getAllBusinessPartners,
  getCarRentalPartners,
  getBusinessPartnerById
};
