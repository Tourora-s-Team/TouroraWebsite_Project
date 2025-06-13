import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import styles from './CarRentalFaq.module.css'; 

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'Tại sao tôi nên thuê xe ô tô trên Traveloka?',
      answer: (
        <p>
          Thuê xe trên Traveloka sẽ giúp bạn tránh khỏi một số rắc rối cũng như tiết kiệm thời gian và tiền bạc.
          Bạn có thể chọn xe từ các đối tác tin cậy của chúng tôi để khám phá thành phố. Đặt xe phù hợp với nhu cầu trên
          Traveloka, bạn sẽ nhận được xác nhận tức thì với mức giá tốt nhất.
        </p>
      )
    },
    {
      question: 'Làm thế nào để đặt xe trên Traveloka?',
      answer: (
        <ol>
          <li>Chọn thành phố/khu vực bạn muốn thuê xe, ngày, khoảng thời gian thuê và thời gian đón.</li>
          <li>Chọn loại xe và nhà cung cấp xe ưa thích của bạn.</li>
          <li>Điền thông tin liên hệ hoặc thông tin khách du lịch nếu bạn đặt xe cho người khác.</li>
          <li>Điền thông tin thuê xe.</li>
          <li>Chọn phương thức thanh toán ưa dùng và xác thực thanh toán.</li>
          <li>Bạn sẽ nhận được email có voucher điện tử từ Traveloka.</li>
        </ol>
      )
    },
    {
      question: 'Tôi có thể đặt xe và được đón trong cùng ngày không?',
      answer: <p>Tất nhiên bạn có thể! Tuy nhiên bạn phải đặt ít nhất 12 tiếng trước giờ đón.</p>
    },
    {
      question: 'Làm thế nào để tôi biết liệu tôi có cần đặt gói sử dụng xe ngoài thành phố?',
      answer: (
        <ol>
          <li>Xem chi tiết thuê xe.</li>
          <li>Dưới mục <strong>Ngoài thành phố</strong>, chạm vào <strong>Xem bản đồ khu vực</strong>.</li>
          <li>Kiểm tra vị trí của bạn ở trong vùng màu đỏ được chỉ định hoặc trong danh sách khu vực.</li>
        </ol>
      )
    },
    {
      question: 'Dịch vụ thuê xe cơ bản bao gồm những gì?',
      answer: (
        <p>
          Dịch vụ thuê xe cơ bản bao gồm việc sử dụng xe trong thành phố tối đa 12 giờ mỗi ngày hoặc tới 23:59 và dịch vụ lái xe.
          Không bao gồm nhiên liệu, phí cầu đường, tiền boa và bữa ăn của tài xế.
        </p>
      )
    },
    {
      question: 'Tôi nên làm gì khi không thể liên lạc với tài xế?',
      answer: (
        <p>
          Vui lòng truy cập <strong>Đặt chỗ của tôi</strong> và liên hệ trực tiếp với nhà cung cấp xe.
          Nếu vẫn không thể liên lạc được, hãy liên hệ bộ phận Hỗ trợ khách hàng của Traveloka.
        </p>
      )
    },
    {
      question: 'Tôi có thể đổi lịch thuê xe của mình không?',
      answer: (
        <p>
          Rất tiếc, bạn không thể đổi lịch thuê xe của mình. Bạn cần hủy đặt chỗ hiện tại và tạo đặt chỗ mới.
        </p>
      )
    }
  ];

  return (
    <div className={styles.faqContainer}>
      <h2 className={styles.faqTitle}>Câu hỏi thường gặp (FAQ)</h2>
      {faqs.map((item, index) => (
        <div key={index} className={styles.faqItem}>
          <h3 className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
            {item.question}  
            <FontAwesomeIcon className={styles.faqIcon} icon={faCaretDown} />
          </h3>
          
          {openIndex === index && (
            <div className={styles.faqAnswer}>
              {item.answer} 
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
