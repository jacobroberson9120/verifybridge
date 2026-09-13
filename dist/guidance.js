// Authored translations; independent native-speaker review is still pending.
export const guidance = {
 en: {
 context:'Read these phrases in context. Quoted warnings and advice can also trigger this checker.',
  labels:{impersonation:'New number combined with a money request'},
  reasons:['Fear can pressure you into responding before checking who is contacting you.','An unusual payment request deserves independent verification; some transfers are difficult to recover.','Passwords and verification codes can give another person access to your accounts.','A deadline can discourage you from taking time to verify a request.','Mentioning an agency does not prove the sender represents it. A legitimate fee can also trigger this warning.','A claimed family emergency can be used to rush a money transfer.','A new-number message combined with a money request can be an impersonation attempt. Call the person on a number you already know.','A promise of approval does not establish that the person can deliver it.','This hostname is outside the official USCIS or ICE domains checked by this tool.'],
  steps:['Pause. Do not reply, pay, or use links in the message until you verify the request.','Contact the person or organization through a number or website you already trust.','For a family emergency, call your relative on their usual number before sending money.','Keep passwords and one-time codes private while you verify the sender.'],
  help:'Already paid or shared information?', recovery:'FTC: steps to take after a scam (English)'
 },
 es: {
 context:'Lee estas frases en contexto. Los consejos y las advertencias citadas también pueden activar la herramienta.',
  labels:{impersonation:'Número nuevo combinado con solicitud de dinero'},
  reasons:['El miedo puede hacer que respondas antes de verificar quién te contacta.','Una solicitud de pago inusual merece verificación independiente; algunas transferencias son difíciles de recuperar.','Las contraseñas y los códigos pueden dar acceso a tus cuentas.','Un plazo puede impedir que te tomes tiempo para verificar.','Mencionar una agencia no demuestra que el remitente la represente. Una tarifa legítima también puede activar esta alerta.','Una supuesta emergencia familiar puede usarse para apresurar una transferencia.','Un mensaje de número nuevo junto con una solicitud de dinero puede ser suplantación. Llama a la persona al número que ya conoces.','Prometer una aprobación no demuestra que la persona pueda conseguirla.','Este dominio está fuera de los dominios oficiales de USCIS o ICE que revisa esta herramienta.'],
  steps:['Espera. No respondas, pagues ni uses enlaces del mensaje hasta verificar la solicitud.','Contacta a la persona u organización por un número o sitio web que ya sea de tu confianza.','Si se trata de una emergencia familiar, llama a tu familiar a su número habitual antes de enviar dinero.','No compartas contraseñas ni códigos de un solo uso mientras verificas al remitente.'],
  help:'¿Ya pagaste o compartiste información?', recovery:'FTC: qué hacer después de una estafa (inglés)'
 },
 vi: {
 context:'Đọc các cụm từ trong ngữ cảnh. Lời khuyên và cảnh báo được trích dẫn cũng có thể kích hoạt công cụ.',
  labels:{impersonation:'Đổi số điện thoại kèm yêu cầu tiền'},
  reasons:['Nỗi sợ có thể khiến bạn trả lời trước khi kiểm tra người liên hệ.','Yêu cầu thanh toán bất thường cần được xác minh độc lập; một số khoản chuyển khó thu hồi.','Mật khẩu và mã xác minh có thể cho người khác truy cập tài khoản của bạn.','Thời hạn gấp có thể khiến bạn không dành thời gian xác minh.','Nhắc tên cơ quan không chứng minh người gửi đại diện cho cơ quan đó. Phí hợp lệ cũng có thể kích hoạt cảnh báo.','Một tình huống khẩn cấp gia đình được viện dẫn có thể thúc ép chuyển tiền.','Tin nhắn đổi số kèm yêu cầu tiền có thể là giả mạo. Hãy gọi người đó bằng số bạn đã biết.','Lời hứa được chấp thuận không chứng minh người đó có thể thực hiện.','Tên miền này nằm ngoài các tên miền USCIS hoặc ICE chính thức mà công cụ kiểm tra.'],
  steps:['Dừng lại. Chưa trả lời, thanh toán hoặc dùng liên kết trong tin nhắn cho đến khi xác minh.','Liên hệ người hoặc tổ chức qua số điện thoại hay trang web bạn đã tin cậy.','Nếu là khẩn cấp gia đình, gọi người thân qua số thường dùng trước khi chuyển tiền.','Giữ kín mật khẩu và mã dùng một lần trong khi xác minh người gửi.'],
  help:'Đã thanh toán hoặc chia sẻ thông tin?', recovery:'FTC: các bước sau khi bị lừa đảo (tiếng Anh)'
 },
 zh: {
 context:'请结合上下文阅读这些短语。引用的警告和建议也可能触发检测。',
  labels:{impersonation:'声称换号并要求付款'},
  reasons:['恐惧可能促使你在核实联系人之前回复。','不寻常的付款要求需要独立核实；某些转账很难追回。','密码和验证码可能让他人进入你的账户。','紧迫的期限可能使你没有时间核实要求。','提及机构名称并不能证明发送者代表该机构。合法费用也可能触发此警告。','声称家人遇到紧急情况可能是为了催促汇款。','声称换了号码并索要钱款的消息可能是假冒。请拨打你已知的号码联系对方。','承诺批准并不能证明此人有能力兑现。','该域名不属于本工具检查的USCIS或ICE官方域名。'],
  steps:['先暂停。在核实要求之前，不要回复、付款或使用消息中的链接。','通过你已信任的电话号码或网站联系对方或机构。','如果声称家人遇到紧急情况，汇款前先拨打家人平时的号码。','核实发送者时，不要分享密码和一次性验证码。'],
  help:'已经付款或分享信息？', recovery:'FTC：遭遇诈骗后可以采取的步骤（英语）'
 }
};
export const reasonIds=['threat','payment','sensitive','urgency','agency','family','impersonation','guarantee','domain'];
export function actionSteps(findings,lang){const g=guidance[lang];return [g.steps[0],g.steps[findings.some(f=>f.id==='family'||f.id==='impersonation')?2:1],...(findings.some(f=>f.id==='sensitive')?[g.steps[3]]:[])];}
