import React from "react";
import styles from "./CarRentalDesPage.module.css"
const CarRentalDetails = () => {

    return (
        <div>
            <div className={styles.paragraph}>
                <hr className={styles.line} />
                <h2 className={styles.paragraphHeading}>Thuê xe tự lái</h2>
                <hr className={styles.line} />
                <p style={{textAlign: 'center'}}>Thuê xe tự lái là lựa chọn tốt nhất để di chuyển linh hoạt khi du lịch cùng gia đình hoặc bạn bè. Với ứng dụng Tourora, bạn có thể thỏa sức tìm kiếm xe với bảng giá chi tiết đi kèm và đặt xe chỉ trong tích tắc.
                    Đặc biệt, thời gian sử dụng xe lên tới 24 tiếng cho mỗi ngày thuê.</p>
            </div>

            <div className={styles.paragraph}>
                <hr className={styles.line} />
                <h2 className={styles.paragraphHeading}>Thuê xe có tài xế</h2>
                <hr className={styles.line} />
                <p style={{ textAlign: 'center' }}>Di chuyển thuận tiện là một vấn đề rất quan trọng khi bạn đi du lịch. Đặc biệt khi bạn mong muốn có một chuyến đi dễ dàng, ít rắc rối khi khám phá nhiều địa điểm du lịch thì việc thuê một chiếc xe có tài xế là lựa chọn hợp lý. Cùng với sự phát triển của kĩ thuật số, bạn có thể dễ dàng tận hưởng dịch vụ cho thuê xe thông qua Ứng dụng Tourora. Dễ dàng so sánh giá từ các đối tác tin cậy của chúng tôi và tìm dịch vụ phù hợp với nhu cầu của mình.</p>
            </div>

            <div className={styles.tableContainer}>
                <h2 className={styles.title}>Yêu cầu chung khi thuê xe</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Yêu cầu chung khi thuê xe tự lái</th>
                            <th>Yêu cầu chung khi thuê xe có tài xế</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <h3>Bao gồm</h3>
                                <ul>
                                    <li>Bảo hiểm cho xe và hành khách</li>
                                    <li>Thời gian sử dụng xe tới 24 tiếng/ngày</li>
                                </ul>
                            </td>
                            <td>
                                <h3>Bao gồm</h3>
                                <ul>
                                    <li>Sử dụng xe trong thành phố</li>
                                    <li>Thời gian thuê đến 12 tiếng hoặc 23:59/ngày</li>
                                </ul>

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Không bao gồm</h3>
                                <ul>
                                    <li>Chi phí nhiên liệu, đón/trả ngoài trung tâm, yêu cầu bồi thường bảo hiểm</li>
                                </ul>
                            </td>
                            <td>
                                <h3>Không bao gồm</h3>
                                <ul>
                                    <li>Nhiên liệu, phí đỗ xe, phí cầu đường, phụ cấp ăn/tips cho tài xế</li>
                                    <li>Phí lưu trú tài xế nếu đi ngoài trung tâm</li>
                                    <li>Sử dụng xe bên ngoài thành phố</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Địa điểm đón khách</h3>
                                Miễn phí đón và trả khách tại sân bay và trong trung tâm thành phố
                            </td>
                            <td>
                                <h3>Địa điểm đón khách</h3>
                                Miễn phí đón và trả khách tại sân bay và trong trung tâm thành phố
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Các giấy tờ cần thiết</h2>
                                <ul>
                                    <li>Chứng minh nhân dân/hộ chiếu gốc, bằng lái xe, thẻ tín dụng của cá nhân hoặc thẻ tín dụng gia đình (hình chụp thẻ gia đình (KK) hoặc giấy chứng nhận kết hôn phải được chia sẻ với đối tác cho thuê trước khi đón để xác thực thẻ tín dụng của thành viên gia đình)</li>
                                </ul>
                            </td>
                            <td>Tài xế sẽ liên lạc với bạn trong khoảng từ 12 - 24 tiếng trước giờ đón khách. Trường hợp thuê xe đi ngay trong ngày, tài xế sẽ liên hệ với bạn nhanh chóng sau khi quá trình đặt xe của bạn được xác nhận.</td>
                        </tr>
                        <tr>
                            <td>
                                Lưu ý: Các tài khoản mạng xã hội và hình chụp cùng CMND cũng được yêu cầu. Nếu bạn không có tài khoản mạng xã hội, nhà cung cấp sẽ yêu cầu một số giấy tờ khác để xác minh. Tìm hiểu thêm tại mục Điều khoản và điều kiện.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CarRentalDetails