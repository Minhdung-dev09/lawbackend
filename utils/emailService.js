import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendOrderConfirmationEmail = async (to, orderDetails) => {
  const {
    orderNumber,
    customerName,
    items,
    totalAmount,
    shippingAddress
  } = orderDetails;

  const itemsList = items
    .map(
      item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.price.toLocaleString("vi-VN")}đ
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${(item.price * item.quantity).toLocaleString("vi-VN")}đ
        </td>
      </tr>
    `
    )
    .join("");

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Xác nhận đơn hàng</h2>
      
      <p>Xin chào ${customerName},</p>
      
      <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Chi tiết đơn hàng #${orderNumber}</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #eee;">
              <th style="padding: 10px; text-align: left;">Sản phẩm</th>
              <th style="padding: 10px; text-align: left;">Số lượng</th>
              <th style="padding: 10px; text-align: left;">Đơn giá</th>
              <th style="padding: 10px; text-align: left;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">
                Tổng cộng:
              </td>
              <td style="padding: 10px; font-weight: bold;">
                ${totalAmount.toLocaleString("vi-VN")}đ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Địa chỉ giao hàng:</h3>
        <p style="margin: 0;">${shippingAddress}</p>
      </div>
      
      <p>
        Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại.
      </p>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Xác nhận đơn hàng #${orderNumber}`,
    html: emailContent
  };

  await transporter.sendMail(mailOptions);
}; 