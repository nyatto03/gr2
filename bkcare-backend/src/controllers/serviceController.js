const Service = require("../models/serviceModel"); // Mô hình Service

// Lấy danh sách dịch vụ
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services" });
    }
};

// Lấy thông tin chi tiết dịch vụ
const getServiceDetails = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate(
            "relatedDoctors"
        );
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service details" });
    }
};

// Thêm dịch vụ mới
const createService = async (req, res) => {
    try {
        if (req.body.relatedDoctors) {
            req.body.relatedDoctors = JSON.parse(req.body.relatedDoctors);
        }
        const { name, description, price, relatedDoctors } = req.body;

        const newService = new Service({
            name,
            description,
            price,
            image: req.file ? `/uploads/${req.file.filename}` : undefined,
            relatedDoctors,
        });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({ message: "Error creating service" });
    }
};

// Cập nhật dịch vụ
const updateService = async (req, res) => {
    try {
        if (req.body.relatedDoctors) {
            req.body.relatedDoctors = JSON.parse(req.body.relatedDoctors);
        }
        const { name, description, price, relatedDoctors } = req.body;
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                relatedDoctors,
                price,
                image: req.file ? `/uploads/${req.file.filename}` : undefined,
            },
            { new: true }
        );
        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: "Error updating service" });
    }
};

module.exports = {
    getAllServices,
    getServiceDetails,
    createService,
    updateService,
};
