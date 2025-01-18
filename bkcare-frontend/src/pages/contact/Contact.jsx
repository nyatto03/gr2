import "./contact.scss";
const Contact = () => {
    return (
        <div>
            <section className="contact" id="contact">
                <h2 className="section-title">Liên Hệ Với Chúng Tôi</h2>
                <p>
                    Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, đừng ngần
                    ngại liên hệ với chúng tôi!
                </p>

                <div className="contact-info">
                    <p>
                        <strong>Email:</strong> support@example.com
                    </p>
                    <p>
                        <strong>Điện Thoại:</strong> +123 456 7890
                    </p>
                    <p>
                        <strong>Địa Chỉ:</strong> 123 Đường Chăm Sóc Sức Khỏe,
                        Thành Phố Sức Khỏe, Quốc Gia
                    </p>
                </div>

                {/* Optional: Contact form */}
            </section>
        </div>
    );
};

export default Contact;
