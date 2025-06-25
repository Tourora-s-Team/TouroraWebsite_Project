const mongoose = require('mongoose');
require('./config/db').connect();

const Hotel = require('./models/hotel');
const Room = require('./models/room');

const hotelsData = [
    {
        name: 'Mercure Danang French Village Bana Hills',
        address: {
            street: 'Bà Nà Hills',
            city: 'Đà Nẵng',
            state: '',
            country: 'Việt Nam',
            zipCode: '550000',
        },
        description: 'Khách sạn phong cách Pháp trên đỉnh Bà Nà.',
        rating: 4.5,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Spa'],
        images: [
            '/assets/images/MercureDanang/1.jpg',
            '/assets/images/MercureDanang/2.jpg',
            '/assets/images/MercureDanang/3.jpg',
            '/assets/images/MercureDanang/4.jpg',
            '/assets/images/MercureDanang/5.jpg',
        ],
        contactInfo: {
            phone: '0123456789',
            email: 'info@mercurebanahills.vn',
            website: 'https://mercurebanahills.com',
        },
    },
    {
        name: 'Hotel Nikko Saigon',
        address: {
            street: '235 Nguyễn Văn Cừ',
            city: 'Hồ Chí Minh',
            state: '',
            country: 'Việt Nam',
            zipCode: '700000',
        },
        description: 'Khách sạn 5 sao hiện đại tại trung tâm Sài Gòn.',
        rating: 4.7,
        amenities: ['WiFi', 'Gym', 'Nhà hàng', 'Bar'],
        images: [
            '/assets/images/HotelNikko/1.jpg',
            '/assets/images/HotelNikko/2.jpg',
            '/assets/images/HotelNikko/3.jpg',
            '/assets/images/HotelNikko/4.jpg',
            '/assets/images/HotelNikko/5.jpg',
        ],
        contactInfo: {
            phone: '0987654321',
            email: 'info@nikkosaigon.com',
            website: 'https://hotelnikkosaigon.com',
        },
    },
    {
        name: 'Melia Hanoi',
        address: {
            street: '44B Lý Thường Kiệt',
            city: 'Hà Nội',
            state: '',
            country: 'Việt Nam',
            zipCode: '100000',
        },
        description: 'Khách sạn sang trọng giữa lòng Hà Nội.',
        rating: 4.6,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Phòng hội nghị'],
        images: [
            '/assets/images/MeliaHanoi/1.jpg',
            '/assets/images/MeliaHanoi/2.jpg',
            '/assets/images/MeliaHanoi/3.jpg',
            '/assets/images/MeliaHanoi/4.jpg',
            '/assets/images/MeliaHanoi/5.jpg',
        ],
        contactInfo: {
            phone: '02439343343',
            email: 'info@meliahanoi.com',
            website: 'https://meliahanoi.com',
        },
    },
    {
        name: 'Premier Village Danang Resort',
        address: {
            street: 'Võ Nguyên Giáp',
            city: 'Đà Nẵng',
            state: '',
            country: 'Việt Nam',
            zipCode: '550000',
        },
        description: 'Resort nghỉ dưỡng bên bờ biển Đà Nẵng.',
        rating: 4.8,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Bãi biển riêng'],
        images: [
            '/assets/images/PremierVillage/1.jpg',
            '/assets/images/PremierVillage/2.jpg',
            '/assets/images/PremierVillage/3.jpg',
            '/assets/images/PremierVillage/4.jpg',
        ],
        contactInfo: {
            phone: '02363919999',
            email: 'info@premierdanang.com',
            website: 'https://premier-village-danang.com',
        },
    },
    {
        name: 'Vinpearl Resort Nha Trang',
        address: {
            street: 'Đảo Hòn Tre',
            city: 'Nha Trang',
            state: '',
            country: 'Việt Nam',
            zipCode: '650000',
        },
        description: 'Khu nghỉ dưỡng cao cấp trên đảo Hòn Tre.',
        rating: 4.7,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Công viên nước'],
        images: [
            '/assets/images/VinpearlResort/1.jpg',
            '/assets/images/VinpearlResort/2.jpg',
            '/assets/images/VinpearlResort/3.jpg',
            '/assets/images/VinpearlResort/4.jpg',
        ],
        contactInfo: {
            phone: '02583555555',
            email: 'info@vinpearl.com',
            website: 'https://vinpearl.com',
        },
    },
    {
        name: 'InterContinental Hanoi Westlake',
        address: {
            street: '5 Từ Hoa Công Chúa',
            city: 'Hà Nội',
            state: '',
            country: 'Việt Nam',
            zipCode: '100000',
        },
        description: 'Khách sạn 5 sao bên hồ Tây.',
        rating: 4.6,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Bar'],
        images: [
            '/assets/images/InterContinental/1.jpg',
            '/assets/images/InterContinental/2.jpg',
            '/assets/images/InterContinental/3.jpg',
            '/assets/images/InterContinental/4.jpg',
        ],
        contactInfo: {
            phone: '02462708888',
            email: 'info@icwestlake.com',
            website: 'https://hanoi.intercontinental.com',
        },
    },
    {
        name: 'Fusion Resort Phu Quoc',
        address: {
            street: 'Vũng Bầu',
            city: 'Phú Quốc',
            state: '',
            country: 'Việt Nam',
            zipCode: '920000',
        },
        description: 'Resort nghỉ dưỡng với dịch vụ spa trọn gói.',
        rating: 4.9,
        amenities: ['WiFi', 'Bể bơi', 'Spa', 'Nhà hàng'],
        images: [
            '/assets/images/FusionResort/1.jpg',
            '/assets/images/FusionResort/2.jpg',
            '/assets/images/FusionResort/3.jpg',
            '/assets/images/FusionResort/4.jpg',
        ],
        contactInfo: {
            phone: '02973555555',
            email: 'info@fusionresortphuquoc.com',
            website: 'https://fusionresortphuquoc.com',
        },
    },
    {
        name: 'The Reverie Saigon',
        address: {
            street: '22-36 Nguyễn Huệ',
            city: 'Hồ Chí Minh',
            state: '',
            country: 'Việt Nam',
            zipCode: '700000',
        },
        description: 'Khách sạn sang trọng bậc nhất Sài Gòn.',
        rating: 4.9,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Spa'],
        images: [
            '/assets/images/TheReverie/1.jpg',
            '/assets/images/TheReverie/2.jpg',
            '/assets/images/TheReverie/3.jpg',
            '/assets/images/TheReverie/4.jpg',
        ],
        contactInfo: {
            phone: '02838238888',
            email: 'info@thereveriesaigon.com',
            website: 'https://thereveriesaigon.com',
        },
    },
    {
        name: 'Lotte Hotel Hanoi',
        address: {
            street: '54 Liễu Giai',
            city: 'Hà Nội',
            state: '',
            country: 'Việt Nam',
            zipCode: '100000',
        },
        description: 'Khách sạn cao cấp với tầm nhìn toàn cảnh thành phố.',
        rating: 4.8,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Bar'],
        images: [
            '/assets/images/LotteHotel/1.jpg',
            '/assets/images/LotteHotel/2.jpg',
            '/assets/images/LotteHotel/3.jpg',
            '/assets/images/LotteHotel/4.jpg',
        ],
        contactInfo: {
            phone: '02433333333',
            email: 'info@lottehotel.com',
            website: 'https://lottehotel.com',
        },
    },
    {
        name: 'Pullman Vung Tau',
        address: {
            street: '15 Thi Sách',
            city: 'Vũng Tàu',
            state: '',
            country: 'Việt Nam',
            zipCode: '780000',
        },
        description: 'Khách sạn hiện đại gần biển Vũng Tàu.',
        rating: 4.5,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Gym'],
        images: [],
        contactInfo: {
            phone: '02543888888',
            email: 'info@pullmanvungtau.com',
            website: 'https://pullmanvungtau.com',
        },
    },
    {
        name: 'Novotel Danang Premier Han River',
        address: {
            street: '36 Bạch Đằng',
            city: 'Đà Nẵng',
            state: '',
            country: 'Việt Nam',
            zipCode: '550000',
        },
        description: 'Khách sạn ven sông Hàn với view tuyệt đẹp.',
        rating: 4.6,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Bar'],
        images: [],
        contactInfo: {
            phone: '02363922222',
            email: 'info@novoteldanang.com',
            website: 'https://novoteldanang.com',
        },
    },
    {
        name: 'Mường Thanh Luxury Nha Trang',
        address: {
            street: '60 Trần Phú',
            city: 'Nha Trang',
            state: '',
            country: 'Việt Nam',
            zipCode: '650000',
        },
        description: 'Khách sạn 5 sao bên bờ biển Nha Trang.',
        rating: 4.4,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Spa'],
        images: [],
        contactInfo: {
            phone: '02583556666',
            email: 'info@muongthanh.com',
            website: 'https://muongthanh.com',
        },
    },
    {
        name: 'Sheraton Grand Danang Resort',
        address: {
            street: '35 Trường Sa',
            city: 'Đà Nẵng',
            state: '',
            country: 'Việt Nam',
            zipCode: '550000',
        },
        description: 'Resort 5 sao với bãi biển riêng.',
        rating: 4.7,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Bar'],
        images: [
            '/assets/images/SheratonGrand/1.jpg',
            '/assets/images/SheratonGrand/2.jpg',
            '/assets/images/SheratonGrand/3.jpg',
            '/assets/images/SheratonGrand/4.jpg',
        ],
        contactInfo: {
            phone: '02363988888',
            email: 'info@sheratongranddanang.com',
            website: 'https://sheratongranddanang.com',
        },
    },
    {
        name: 'Vinpearl Discovery Ha Tinh',
        address: {
            street: 'Thịnh Lộc',
            city: 'Hà Tĩnh',
            state: '',
            country: 'Việt Nam',
            zipCode: '480000',
        },
        description: 'Khu nghỉ dưỡng cao cấp tại Hà Tĩnh.',
        rating: 4.3,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Spa'],
        images: [],
        contactInfo: {
            phone: '02393888888',
            email: 'info@vinpearlhatinh.com',
            website: 'https://vinpearl.com',
        },
    },
    {
        name: 'Radisson Blu Resort Phu Quoc',
        address: {
            street: 'Bãi Dài',
            city: 'Phú Quốc',
            state: '',
            country: 'Việt Nam',
            zipCode: '920000',
        },
        description: 'Resort 5 sao với nhiều tiện ích.',
        rating: 4.5,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Bar'],
        images: [],
        contactInfo: {
            phone: '02973556666',
            email: 'info@radissonblu.com',
            website: 'https://radissonblu.com',
        },
    },
    {
        name: 'Grand Mercure Danang',
        address: {
            street: 'Lot A1, Green Island',
            city: 'Đà Nẵng',
            state: '',
            country: 'Việt Nam',
            zipCode: '550000',
        },
        description: 'Khách sạn 5 sao gần sông Hàn.',
        rating: 4.4,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Spa'],
        images: [],
        contactInfo: {
            phone: '02363999999',
            email: 'info@grandmercuredanang.com',
            website: 'https://grandmercuredanang.com',
        },
    },
    {
        name: 'Sofitel Legend Metropole Hanoi',
        address: {
            street: '15 Ngô Quyền',
            city: 'Hà Nội',
            state: '',
            country: 'Việt Nam',
            zipCode: '100000',
        },
        description: 'Khách sạn lịch sử nổi tiếng Hà Nội.',
        rating: 4.9,
        amenities: ['WiFi', 'Bể bơi', 'Nhà hàng', 'Spa'],
        images: [
            '/assets/images/SofitelLegend/1.jpg',
            '/assets/images/SofitelLegend/2.jpg',
            '/assets/images/SofitelLegend/3.jpg',
            '/assets/images/SofitelLegend/4.jpg',
        ],
        contactInfo: {
            phone: '02438266919',
            email: 'info@sofitel.com',
            website: 'https://sofitel-legend-metropole-hanoi.com',
        },
    },
];

const roomTypes = ['Single', 'Double', 'Twin', 'Suite', 'Deluxe'];
const bedTypes = ['Single Bed', 'Double Bed', 'Queen Bed', 'King Bed', 'Twin Beds'];

const seedDatabase = async () => {
    try {
        // Xóa dữ liệu cũ
        await Room.deleteMany({});
        await Hotel.deleteMany({});
        console.log('🗑️ Đã xóa dữ liệu cũ');

        // Thêm hotel mẫu
        const hotelDocs = await Hotel.insertMany(hotelsData);
        console.log('🏨 Đã thêm hotel mẫu:', hotelDocs.length);

        // Tạo room mẫu
        let rooms = [];
        hotelDocs.forEach((hotel, idx) => {
            rooms.push({
                hotelId: hotel._id,
                roomNumber: `10${idx + 1}`,
                type: roomTypes[idx % roomTypes.length],
                capacity: 2 + (idx % 3),
                pricePerNight: 500000 + idx * 100000,
                amenities: ['WiFi', 'Điều hòa', 'Tivi'],
                images: hotel.images && hotel.images.length > 0 ? [hotel.images[0]] : [],
                status: 'Available',
                description: `Phòng ${roomTypes[idx % roomTypes.length]} tại ${hotel.name}`,
                area: 25 + idx * 2,
                bedType: bedTypes[idx % bedTypes.length],
                isActive: true,
            });
        });
        for (let i = hotelDocs.length; i < 16; i++) {
            const hotel = hotelDocs[i % hotelDocs.length];
            rooms.push({
                hotelId: hotel._id,
                roomNumber: `20${i}`,
                type: roomTypes[i % roomTypes.length],
                capacity: 2 + (i % 3),
                pricePerNight: 600000 + i * 100000,
                amenities: ['WiFi', 'Điều hòa', 'Tivi'],
                images: hotel.images && hotel.images.length > 0 ? [hotel.images[0]] : [],
                status: 'Available',
                description: `Phòng ${roomTypes[i % roomTypes.length]} tại ${hotel.name}`,
                area: 28 + i * 2,
                bedType: bedTypes[i % bedTypes.length],
                isActive: true,
            });
        }
        await Room.insertMany(rooms);
        console.log('🛏️ Đã thêm room mẫu:', rooms.length);

        console.log('✅ Seed thành công!');
    } catch (error) {
        console.error('❌ Lỗi seed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('📡 Đã đóng kết nối database');
    }
};

seedDatabase();
