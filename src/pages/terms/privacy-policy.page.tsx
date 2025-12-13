import React, { useEffect, useState } from "react"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"

const PrivacyPolicy = () => {
  const { i18n } = useTranslation()
  const language = i18n.language as Language
  const [privacyPolicy, setPrivacyPolicy] = useState("")

  const privacyPolicyKor = `
개인정보처리방침

제1조(개인정보의 처리목적)
 페슈의원(이하 ‘병원’)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
변경되는 경우에는 ｢개인정보 보호법｣ 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
1.홈페이지 이용자 관리
홈페이지 이용자의 식별 및 관리, 부정이용 방지, 각종 고지·통지 목적
2.재화 또는 서비스 제공 
진료·진료 예약, 상담서비스 제공, 진료기록 등 정보 열람, 건강관련 콘텐츠 제공, 맞춤서비스 제공, 요금결제·정산, 채권추심, 마케팅·프로모션·이벤트 운영, 민원인의 신원·민원사항 확인, 고충처리 등 목적
3.임직원 및 제휴사 관리 
임직원 채용, 임직원 관리, 수탁사 및 제휴사 관리 목적

제2조(개인정보의 처리 및 보유기간) 
① 병원은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
1.홈페이지 이용자 관리 : 상거래관계 종료시로부터 5년간
다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
1) 불법행위에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지
2) 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지
2. 재화 또는 서비스 제공 : 상거래관계 종료시로부터 5년간
다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지
1) 「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 표시·광고, 계약내용 및 이행 등 거래에 관한 기록
- 표시·광고에 관한 기록 : 6개월
- 계약 또는 청약철회, 대금결제, 서비스 등의 공급기록 : 5년
- 소비자 불만 또는 분쟁처리에 관한 기록 : 3년
2)「통신비밀보호법」에 따른 통신사실확인자료 보관
- 가입자 전기통신일시, 개시·종료시간, 상대방 가입자번호, 사용도수, 발신기지국 위치추적자료 : 1년
- 컴퓨터통신, 인터넷 로그기록자료, 접속지 추적자료 : 3개월
3) 「의료법」에 따른 진료기록부 등의 보관
- 환자 명부 : 5년
- 진료기록부 : 10년
- 처방전 : 2년
- 수술기록 : 10년
- 검사내용 및 검사소견기록 : 5년
- 방사선 사진(영상물을 포함한다) 및 그 소견서 : 5년
- 간호기록부 : 5년
- 진단서 등의 부본 : 3년
- 단, 계속적인 진료를 위하여 필요한 경우에는 1회에 한하여 위 기간동안 연장하여 보존
3.임직원 및 제휴사 관리 
- 임직원 정보 : 퇴직시로부터 3년
- 지원자 정보 : 채용 종료시로부터 1년
- 제휴사 및 수탁사 담당자 정보 : 거래관계 종료시로부터 5년

제3조(개인정보의 제3자 제공) 병원은 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 ｢개인정보 보호법｣ 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.

제4조(개인정보처리의 위탁) ① 병원은 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.

② 병원은 위탁계약 체결 시 ｢개인정보 보호법｣ 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.

제5조(정보주체와 법정대리인의 권리·의무 및 행사방법) ① 정보주체는 병원에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
② 제1항에 따른 권리 행사는 병원에 대해 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며, 병원은 이에 대해 지체없이 조치하겠습니다.
③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
④ 개인정보 열람 및 처리정지 요구는 개인정보보호법 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수 있습니다.
⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
⑥ 병원은 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.

제6조(처리하는 개인정보 항목) 병원은 다음의 개인정보 항목을 처리하고 있습니다.
1.홈페이지 이용자 관리
성명, 14세 이상 해당여부, 전화번호, 이메일주소
2. 재화 또는 서비스 제공
필수항목: 성명, 생년월일, 성별, 주소, 전화번호, 이메일주소, 결제정보(신용카드정보 등)
선택항목: 관심시술분야, 과거 시술경험, 과거 병력, 복용 약품 정보, 알레르기 반응 여부
3. 임직원 및 제휴사 관리
필수항목 : <임직원 및 지원자> 성명, 생년월일, 주소, 연락처, 경력정보
<제휴사 담당자> 성명, 연락처, 직장, 담당업무
선택항목 : <임직원> 병원 출입을 위한 지문
4. 인터넷 서비스 이용과정에서 IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록이 자동으로 생성되어 수집될 수 있습니다.

제7조(개인정보의 파기) ① 병원은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
1.파기절차
병원은 파기 사유가 발생한 개인정보를 선정하고, <개인정보처리자명>의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
2. 파기방법
병원은 전자적 파일 형태로 기록․저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.

제8조(개인정보의 안전성 확보조치) 병원은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
1.관리적 조치 : 내부관리계획 수립·시행, 정기적 직원 교육 등
2.기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치
3.물리적 조치 : 전산실, 자료보관실 등의 접근통제

제9조(개인정보 자동 수집 장치의 설치∙운영 및 거부에 관한 사항) 
① 병원은 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.
② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 등 기기 브라우저에게 보내는 소량의 정보로서 이용자들의 기기에 저장되기도 합니다.
가. 쿠키의 사용목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
나. 쿠키의 설치∙운영 및 거부 : 웹브라우저 상단의 도구>인터넷 옵션>개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.
다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.

제10조(개인정보 보호책임자) 
① 병원은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보
보호책임자를 지정하고 있습니다.
② 정보주체께서는 병원의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 병원은 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.

제11조(추가적인 이용·제공 판단기준) 병원은 ｢개인정보 보호법｣ 제15조제3항 및 제17조제4항에 따라 ｢개인정보 보호법 시행령｣ 제14조의2에 따른 사항을 고려하여 정보주체의 동의 없이 개인정보를 추가적으로 이용·제공할 수 있습니다.
이에 따라 병원이 정보주체의 동의 없이 추가적인 이용·제공을 하기 위해서 다음과 같은 사항을 고려하였습니다.
개인정보를 추가적으로 이용·제공하려는 목적이 당초 수집 목적과 관련성이 있는지 여부
- 개인정보를 수집한 정황 또는 처리 관행에 비추어 볼 때 추가적인 이용·제공에 대한 예측 가능성이 있는지 여부
- 개인정보의 추가적인 이용·제공이 정보주체의 이익을 부당하게 침해하는지 여부
- 가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지 여부

제12조(개인정보 열람청구) 정보주체는 ｢개인정보 보호법｣ 제35조에 따른 개인정보의 열람 청구를 제10조의 개인정보담당부서에 할 수 있습니다.

제13조(권익침해 구제방법) 정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
1.개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
2.개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
3.대검찰청 : (국번없이) 1301 (www.spo.go.kr)
4.경찰청 : (국번없이) 182 (cyberbureau.police.go.kr)

제14조(영상정보처리기기 설치·운영) ① 병원은 아래와 같이 영상정보처리기기를 설치·운영하고 있습니다.
1.영상정보처리기기 설치근거·목적 : 병원의 시설안전·화재예방
2.설치 대수, 설치 위치, 촬영 범위 : 병원 진료실, 복도 등에 5대 설치하여 해당공간의 전 범위를 촬영
3.관리책임자, 담당자 및 영상정보에 대한 접근권한자
- 관리책임자 겸 담당자: 박기범 대표원장
- 영상정보 접근권한자: ㈜메디클라우드 운영팀, ㈜에스원
4. 영상정보 촬영시간, 보관기간, 보관장소, 처리방법
- 촬영시간 : 24시간 촬영
- 보관기간 : 촬영시부터 7일
- 보관장소 및 처리방법 : 영상정보처리기기 통제실에 보관·처리
5. 영상정보 확인 방법 및 장소 : 제10조의 개인정보담당부서에 요청
6. 정보주체의 영상정보 열람 등 요구에 대한 조치 : 개인영상정보 열람․존재확인 청구서로 신청하여야 하며, 정보주체 자신이 촬영된 경우 또는 명백히 정보주체의 생명․신체․재산 이익을 위해 필요한 경우에 한해 열람을 허용함
7. 영상정보 보호를 위한 기술적·관리적·물리적 조치 : 내부관리계획 수립, 접근통제 및 접근권한 제한, 영상정보의 안전한 저장·전송기술 적용, 처리기록 보관 및 위·변조 방지조치, 보관시설 마련 및 잠금장치 설치 등

제15조(개인정보 처리방침의 적용 및 변경) 이 개인정보 처리방침은 2025. 12. 01 부터 적용됩니다.
`

  const privacyPolicyEng = `
Privacy Policy

Article 1 (Purpose of Processing Personal Information)
PECHE Hospital (hereinafter referred to as the 'Hospital') processes personal information for the following purposes. The personal information processed shall not be used for any purpose other than the following purposes, and if the purpose of use changes
If the purpose of use is changed, we will take necessary measures such as obtaining separate consent in accordance with Article 18 of the Personal Information Protection Act.
1.Homepage user management
Identification and management of website users, prevention of unauthorized use, and various notices and notifications.
2.Provision of goods or services 
To provide medical treatment, medical appointments, counseling services, access to information such as medical records, health-related content, customized services, payment and settlement, debt collection, marketing, promotion and event management, identification of complainants and complaints, grievance handling, etc.
3.Management of employees and affiliates 
To recruit employees, manage employees, and manage trustees and affiliates

Article 2 (Processing and Retention Period of Personal Information) 
① The hospital shall process and retain personal information within the period of retention and use of personal information in accordance with the laws and regulations or the period of retention and use of personal information agreed upon when collecting personal information from the information subject.
The processing and retention periods for each personal information are as follows.
1.Homepage user management: 5 years from the end of the commercial relationship
However, in the case of the following reasons, until the end of the relevant reason
1) In the event of an ongoing investigation or inquiry into an illegal act, until the end of such investigation or inquiry.
2) In the event that a bond or debt relationship remains, until the settlement of the bond or debt relationship.
2. Provision of goods or services: 5 years from the end of the commercial relationship
However, in the case of the following reasons, until the end of the period
1) Records of transactions such as display, advertisement, contract contents and performance in accordance with the Act on Consumer Protection in Electronic Commerce, etc.
- Records on display and advertisement: 6 months
- Records of contract or subscription withdrawal, payment, and supply of services: 5 years
- Records on consumer complaints or dispute handling: 3 years
2) Retention of telecommunication fact verification data in accordance with the 「Communications Secrecy Protection Act
- Subscriber telecommunication date, start and end time, other party's subscriber number, usage, and location tracking data of the sending base station: 1 year
- Computer communication, Internet log data, access point tracking data: 3 months
3) Retention of medical records in accordance with the Medical Act
- Patient register: 5 years
- Medical records: 10 years
- Prescription: 2 years
- Surgical records: 10 years
- Records of examination contents and examination findings: 5 years
- Radiographs (including imaging) and their opinions: 5 years
- Nursing records: 5 years
- Copies of medical certificates, etc.: 3 years
- However, if necessary for continued medical treatment, it may be extended and preserved for the above period only once.
3.Management of employees and affiliates 
- Employee information: 3 years from retirement
- Applicant information: 1 year from the end of recruitment
- Information on affiliates and trustees: 5 years from the end of the business relationship

Article 3 (Provision of Personal Information to Third Parties) The hospital processes the personal information of the information subject only within the scope specified in Article 1 (Purpose of Processing Personal Information) and provides personal information to third parties only in cases falling under Articles 17 and 18 of the Personal Information Protection Act, such as the consent of the information subject or special provisions of the law.

Article 4 (Consignment of Personal Information Processing) ① The hospital consigns personal information processing tasks as follows for smooth personal information processing.

② When concluding a consignment contract, the hospital shall specify in documents such as contracts the prohibition of processing personal information other than for the purpose of performing consignment work, technical and administrative protection measures, restrictions on re-consignment, management and supervision of the consignee, and responsibilities such as compensation for damages in accordance with Article 26 of the Personal Information Protection Act, and supervise whether the consignee processes personal information safely.
③ If the contents of the entrusted work or the entrustee are changed, we will disclose it through this personal information processing policy without delay.

Article 5 (Rights, Obligations, and Exercise Methods of Information Subjects and Legal Representatives) ① Information subjects may exercise their rights to view, correct, delete, or request suspension of processing of personal information at any time against the hospital.
② The exercise of the rights under Paragraph (1) may be made in writing, e-mail, etc. to the hospital in accordance with Article 41 (1) of the Enforcement Decree of the Personal Information Protection Act, and the hospital will take action without delay.
③ The exercise of the rights under Paragraph 1 may be made through an agent, such as the legal representative of the information subject or a person who has been delegated. In this case, you must submit a power of attorney in the form of Attachment No. 11 to the ""Notice on Personal Information Processing Method"".
④ Requests for access to personal information and suspension of processing may restrict the rights of the information subject under Article 35, Paragraph 4, and Article 37, Paragraph 2 of the Personal Information Protection Act.
⑤ A request for correction and deletion of personal information cannot be made if the personal information is specified as the subject of collection in another law.
⑥ The hospital shall verify whether the person making a request for access, correction, deletion, or suspension of processing in accordance with the rights of the information subject is the person or a legitimate representative.

Article 6 (Personal Information Items Processed) The hospital processes the following personal information items.
1.Homepage user management
Name, age 14 or older, phone number, email address
2. Provision of goods or services
Required items: name, date of birth, gender, address, phone number, e-mail address, payment information (credit card information, etc.)
Optional items: areas of interest, past treatment experience, past medical history, medication information, allergic reactions, etc.
3. Management of employees and affiliates
Required items: <Employees and applicants> Name, date of birth, address, contact information, career information
<Affiliate Representative> Name, contact information, workplace, and responsibilities
Optional: <Employees> Fingerprint for hospital access
4. IP address, cookies, MAC address, service usage records, and visit records may be automatically generated and collected in the process of using Internet services.

Article 7 (Destruction of Personal Information) ① The hospital shall destroy personal information without delay when it becomes unnecessary, such as the expiration of the personal information retention period or the achievement of the purpose of processing.
If the hospital is required to continue to preserve personal information in accordance with laws and regulations even though the personal information retention period agreed to by the information subject has elapsed or the purpose of processing has been achieved, the personal information shall be transferred to a separate database (DB) or preserved in a different storage location.
③ The procedures and methods for destroying personal information are as follows.
1.Destruction Procedure
The hospital selects the personal information for which the reason for destruction has occurred and destroys the personal information with the approval of the personal information protection officer of <personal information processor name>.
2. destruction method
The hospital destroys personal information recorded and stored in the form of electronic files so that the records cannot be reproduced, and destroys personal information recorded and stored in paper documents by shredding or incinerating them.

Article 8 (Measures to ensure the safety of personal information) The hospital takes the following measures to ensure the safety of personal information.
1.Administrative measures: establishment and implementation of internal management plans, regular employee training, etc.
2.Technical measures: management of access rights to personal information processing systems, installation of access control systems, encryption of unique identification information, installation of security programs, etc.
3.Physical measures: Access control to computer rooms, data storage rooms, etc.

Article 9 (Installation, operation and rejection of automatic personal information collection devices) 
The hospital uses 'cookies' to store and retrieve user information in order to provide individualized customized services to users.
Cookies are small amounts of information that the server (HTTP) used to operate the website sends to the browser of a device such as a user's computer and are also stored on the user's device.
A. Purpose of use of cookies: Cookies are used to provide optimized information to users by identifying the type of visit and use of each service and website visited by users, popular search terms, and whether the user has a secure connection.
B. Installation, operation and rejection of cookies: You can reject the storage of cookies by setting the options in the Tools>Internet Options>Privacy menu at the top of the web browser.
C. If you refuse to save cookies, you may experience difficulties in using customized services.

Article 10 (Personal Information Protection Officer) 
① The hospital shall be responsible for the processing of personal information in general, and shall designate a personal information protection officer as follows to handle complaints and damage relief of information subjects related to the processing of personal information.
personal information protection officer as follows.
② The information subject may contact the personal information protection officer and the department in charge for all personal information protection-related inquiries, complaints, and damage relief that occurred while using the hospital's services (or business). The hospital will respond to and handle inquiries from information subjects without delay.

Article 11 (Judgment Criteria for Additional Use and Provision) In accordance with Articles 15(3) and 17(4) of the Personal Information Protection Act, the hospital may additionally use and provide personal information without the consent of the information subject in consideration of Article 14(2) of the Enforcement Decree of the Personal Information Protection Act.
Accordingly, in order for the hospital to make additional use and provision without the consent of the information subject, the following points have been considered.
Whether the purpose of further use and provision of personal information is related to the original purpose of collection.
- Whether the additional use or provision of personal information is foreseeable in light of the circumstances under which the personal information was collected or the processing practices.
- Whether the additional use or provision of personal information unreasonably infringes on the interests of the data subject.
- Whether necessary measures have been taken to ensure safety, such as pseudonymization or encryption.

Article 12 (Request for access to personal information) The information subject may request access to personal information pursuant to Article 35 of the Personal Information Protection Act to the personal information department in charge of Article 10.

Article 13 (Remedies for infringement of rights and interests) The information subject may apply for dispute resolution or consultation to the Personal Information Dispute Mediation Committee or the Personal Information Infringement Reporting Center of the Korea Internet and Security Agency to receive relief due to personal information infringement. In addition, please contact the following organizations for reporting and counseling on other personal information infringement.
1.Personal Information Dispute Mediation Committee: (without area code) 1833-6972 (www.kopico.go.kr)
2.Personal Information Infringement Reporting Center: (without area code) 118 (privacy.kisa.or.kr)
3.Supreme Public Prosecutors' Office: 1301 (without area code) (www.spo.go.kr)
4.National Police Agency: (without area code) 182 (cyberbureau.police.go.kr)

Article 14 (Installation and Operation of Image Information Processing Equipment) ① The hospital installs and operates image information processing equipment as follows.
1.Basis and purpose of installing image information processing equipment: facility safety and fire prevention of the hospital
2.Number, location, and scope of installation: 5 devices are installed in hospital treatment rooms and corridors to cover the entire area.
3.Manager, person in charge and authorized person to access video information
- Manager and person in charge: Mr. Park Ki-beom
- Authorized person to access video information: MediCloud Operation Team, S-One Inc.
4. Video information shooting time, storage period, storage place, and processing method
- Filming time: 24 hours
- Storage period: 7 days from the time of shooting
- Storage place and processing method: Storage and processing in the video information processing equipment control room
5. How and where to check video information: Request to the personal information department in Article 10
6. Measures for the request of the information subject to view the video information: It must be applied with a personal video information viewing and existence confirmation request, and access is allowed only when the information subject himself is filmed or when it is clearly necessary for the life, body, and property interests of the information subject.
7. Technical, administrative, and physical measures to protect video information: establishment of internal management plans, access control and restriction of access rights, application of safe storage and transmission technology of video information, storage of processing records and measures to prevent forgery and tampering, provision of storage facilities and installation of locks, etc.

Article 15 (Application and Change of Privacy Policy) This Privacy Policy shall be applied from December 1, 2025.
`

  const privacyPolicyChn = `
个人情报处理方针

第1条（个人信息处理目的）
可感知美丽的韩国江南诗丽雅皮肤科（以下简称"医院"）为以下目的处理个人信息。 正在处理的个人信息不得用于下列目的以外的其他用途, 使用目的
变更时,将根据《个人信息保护法》第18条,另行得到同意等,将履行必要的措施。
1.主页用户管理
主页用户的识别及管理、防止不正当使用、各种通知、通知目的
2.提供财物或服务 
诊疗预约、提供咨询服务、阅览诊疗记录等信息、提供健康相关内容、提供量身定做型服务、结算费用、追讨债券、运营营销、促销和活动，确认信访人的身份和信访事项，处理苦衷等目的
3.管理职员及合作公司 
员工招聘、员工管理、受托公司及合作公司管理目的

第2条（个人信息处理及保留时间） 
① 医院根据法令,在个人信息拥有、使用期间或从信息主体收集个人信息时,在得到同意的个人信息拥有、使用期间内处理、拥有个人信息。
② 各个人信息处理及保留时间如下。
1. 主页用户管理:自商业交易关系终止之日起5年内
但是,如果属于以下事由,直到该事由结束为止。
1) 根据非法行为进行调查、调查等时,直到该调查、调查结束为止
2) 债权、债务关系残存时，直至清算该债权、债务关系为止
2. 提供财物或服务:自商业交易关系终止之日起5年内
但是,如果符合以下理由,直到该期限结束为止。
1) 根据《电子商务等消费者保护相关法律》的标示、广告、合同内容及履行等交易相关记录
- - 显示·广告相关记录:6个月
- - 合同或取消订购、货款结算、服务等供应记录:5年
- - 消费者投诉或纠纷处理相关记录:3年
2)根据《通信秘密保护法》保管通信事实确认资料
- - 用户电气通信时间、开始·终止时间、对方用户编号、使用次数、发信基站位置追踪资料:1年
- - 计算机通信、网络日志记录资料、访问地追踪资料:3个月
3) 根据《医疗法》保管诊疗记录簿等
- - 患者名册:5年제1조(개인정보의 처리목적)
 페슈의원(이하 ‘병원’)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
변경되는 경우에는 ｢개인정보 보호법｣ 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
1.홈페이지 이용자 관리
홈페이지 이용자의 식별 및 관리, 부정이용 방지, 각종 고지·통지 목적
2.재화 또는 서비스 제공 
진료·진료 예약, 상담서비스 제공, 진료기록 등 정보 열람, 건강관련 콘텐츠 제공, 맞춤서비스 제공, 요금결제·정산, 채권추심, 마케팅·프로모션·이벤트 운영, 민원인의 신원·민원사항 확인, 고충처리 등 목적
3.임직원 및 제휴사 관리 
임직원 채용, 임직원 관리, 수탁사 및 제휴사 관리 목적

제2조(개인정보의 처리 및 보유기간) 
① 병원은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
1.홈페이지 이용자 관리 : 상거래관계 종료시로부터 5년간
다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
1) 불법행위에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지
2) 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지
2. 재화 또는 서비스 제공 : 상거래관계 종료시로부터 5년간
다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지
1) 「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 표시·광고, 계약내용 및 이행 등 거래에 관한 기록
- 표시·광고에 관한 기록 : 6개월
- 계약 또는 청약철회, 대금결제, 서비스 등의 공급기록 : 5년
- 소비자 불만 또는 분쟁처리에 관한 기록 : 3년
2)「통신비밀보호법」에 따른 통신사실확인자료 보관
- 가입자 전기통신일시, 개시·종료시간, 상대방 가입자번호, 사용도수, 발신기지국 위치추적자료 : 1년
- 컴퓨터통신, 인터넷 로그기록자료, 접속지 추적자료 : 3개월
3) 「의료법」에 따른 진료기록부 등의 보관
- 환자 명부 : 5년
`

  const privacyPolicyTwn = `
个人情报处理方针

第1条（个人信息处理目的）
Peche露岱皮膚科（以下简称"医院"）为以下目的处理个人信息。 正在处理的个人信息不得用于下列目的以外的其他用途, 使用目的
变更时,将根据《个人信息保护法》第18条,另行得到同意等,将履行必要的措施。
1.主页用户管理
主页用户的识别及管理、防止不正当使用、各种通知、通知目的
2.提供财物或服务 
诊疗预约、提供咨询服务、阅览诊疗记录等信息、提供健康相关内容、提供量身定做型服务、结算费用、追讨债券、运营营销、促销和活动，确认信访人的身份和信访事项，处理苦衷等目的
3.管理职员及合作公司 
员工招聘、员工管理、受托公司及合作公司管理目的

第2条（个人信息处理及保留时间） 
① 医院根据法令,在个人信息拥有、使用期间或从信息主体收集个人信息时,在得到同意的个人信息拥有、使用期间内处理、拥有个人信息。
② 各个人信息处理及保留时间如下。
1. 主页用户管理:自商业交易关系终止之日起5年内
但是,如果属于以下事由,直到该事由结束为止。
1) 根据非法行为进行调查、调查等时,直到该调查、调查结束为止
2) 债权、债务关系残存时，直至清算该债权、债务关系为止
2. 提供财物或服务:自商业交易关系终止之日起5年内
但是,如果符合以下理由,直到该期限结束为止。
1) 根据《电子商务等消费者保护相关法律》的标示、广告、合同内容及履行等交易相关记录
- - 显示·广告相关记录:6个月
- - 合同或取消订购、货款结算、服务等供应记录:5年
- - 消费者投诉或纠纷处理相关记录:3年
2)根据《通信秘密保护法》保管通信事实确认资料
- - 用户电气通信时间、开始·终止时间、对方用户编号、使用次数、发信基站位置追踪资料:1年
- - 计算机通信、网络日志记录资料、访问地追踪资料:3个月
3) 根据《医疗法》保管诊疗记录簿等
- - 患者名册:5年제1조(개인정보의 처리목적)
아름다움을 감각하다 노드의원(이하 ‘병원’)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
변경되는 경우에는 ｢개인정보 보호법｣ 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
1.홈페이지 이용자 관리
홈페이지 이용자의 식별 및 관리, 부정이용 방지, 각종 고지·통지 목적
2.재화 또는 서비스 제공 
진료·진료 예약, 상담서비스 제공, 진료기록 등 정보 열람, 건강관련 콘텐츠 제공, 맞춤서비스 제공, 요금결제·정산, 채권추심, 마케팅·프로모션·이벤트 운영, 민원인의 신원·민원사항 확인, 고충처리 등 목적
3.임직원 및 제휴사 관리 
임직원 채용, 임직원 관리, 수탁사 및 제휴사 관리 목적

제2조(개인정보의 처리 및 보유기간) 
① 병원은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
1.홈페이지 이용자 관리 : 상거래관계 종료시로부터 5년간
다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
1) 불법행위에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지
2) 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지
2. 재화 또는 서비스 제공 : 상거래관계 종료시로부터 5년간
다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지
1) 「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 표시·광고, 계약내용 및 이행 등 거래에 관한 기록
- 표시·광고에 관한 기록 : 6개월
- 계약 또는 청약철회, 대금결제, 서비스 등의 공급기록 : 5년
- 소비자 불만 또는 분쟁처리에 관한 기록 : 3년
2)「통신비밀보호법」에 따른 통신사실확인자료 보관
- 가입자 전기통신일시, 개시·종료시간, 상대방 가입자번호, 사용도수, 발신기지국 위치추적자료 : 1년
- 컴퓨터통신, 인터넷 로그기록자료, 접속지 추적자료 : 3개월
3) 「의료법」에 따른 진료기록부 등의 보관
- 환자 명부 : 5년
`

  const privacyPolicyJpn = `
個人情報処理方針

第1条（個人情報の処理目的）
美しさを感覚する セニア医院(以下「病院」という。)は、次の目的のために個人情報を処理します。 処理している個人情報は、次の目的以外の用途には利用されず、利用目的が
変更される場合は、「個人情報保護法」第18条に基づき、別途の同意を得るなど、必要な措置を履行する予定です。
1.ホームページ利用者管理
ホームページ利用者の識別及び管理、不正利用防止、各種告知·通知目的
2.財貨またはサービス提供
診療·診療予約、相談サービス提供、診療記録などの情報閲覧、健康関連コンテンツ提供、カスタマイズサービス提供、料金決済·精算、債権取立て、マーケティング·プロモーション·イベント運営、苦情者の身元·苦情事項確認、苦情処理などの目的
3.役職員及び提携会社の管理
役職員の採用、役職員の管理、受託会社及び提携会社の管理目的

第2条（個人情報の処理及び保有期間）
① 病院は法令に基づく個人情報保有·利用期間または情報主体から個人情報を収集する際に同意された個人情報保有·利用期間内で個人情報を処理·保有します。
② それぞれの個人情報の処理および保有期間は次のとおりです。
1.ホームページ利用者管理:商取引関係終了時から5年間
ただし、次の事由に該当する場合には、当該事由終了時まで
1) 不法行為による捜査·調査等が進行中の場合は、当該捜査·調査終了時まで
2) 債権·債務関係残存時には、当該債権·債務関係精算時まで
財貨またはサービス提供:商取引関係終了時から5年間
ただし、次の事由に該当する場合には、当該期間終了時まで
1) 「電子商取引等における消費者保護に関する法律」に基づく表示·広告、契約内容及び履行等取引に関する記録
表示·広告に関する記録:6ヶ月
契約または契約の申込みの撤回、代金決済、サービスなどの供給記録:5年
消費者 苦情または紛争処理に関する記録:3年
2)「通信秘密保護法」に基づく通信事実確認資料の保管
加入者電気通信日時、開始·終了時間、相手加入者番号、使用度数、発信基地局位置追跡資料:1年
コンピュータ通信、インターネットログ記録資料、接続先追跡資料:3ヶ月
3) 医療法に基づく診療記録簿等の保管
患者名簿:5年
診療記録簿:10年
処方箋:2年
手術記録:10年
検査内容及び検査所見記録:5年
放射線写真（映像物を含む。）及びその所見書:5年
看護記録簿:5年
診断書等の副本:3年
ただし、継続的な診療のために必要な場合には、1回に限り上記期間の延長して保存
3.役職員及び提携会社の管理
役職員情報:退職時から3年
志願者情報:採用終了時から1年
提携会社及び受託会社担当者情報:取引関係終了時から5年

第3条（個人情報の第3者提供）病院は、情報主体の個人情報を第1条（個人情報の処理目的）で明示した範囲内でのみ処理し、情報主体の同意、法律の特別な規定など「個人情報保護法」第17条及び第18条に該当する場合にのみ、個人情報を第3者に提供します。

第4条（個人情報処理の委託）①病院は円滑な個人情報業務処理のため、次のように個人情報処理業務を委託しています。

② 病院は委託契約締結時に「個人情報保護法」第26条に基づき、委託業務遂行目的以外の個人情報処理禁止、技術的·管理的保護措置、再委託制限、受託者に対する管理·監督、損害賠償などの責任に関する事項を契約書などの文書に明示し、受託者が個人情報を安全に処理するかを監督しています。
③ 委託業務の内容や受託者が変更された場合は、遅滞なく本個人情報処理方針を通じて公開するようにします。

第5条（情報主体と法定代理人の権利·義務および行使方法）①情報主体は病院に対していつでも個人情報閲覧·訂正·削除·処理停止要求などの権利を行使することができます。
② 第1項による権利行使は病院に対して個人情報保護法施行令第41条第1項により書面、電子メール等を通じて行うことができ、病院はこれに対して遅滞なく措置します。
③ 第1項による権利行使は、情報主体の法定代理人や委任を受けた者など代理人を通じて行うことができます。 この場合、「個人情報処理方法に関する告示」別紙第11号書式による委任状を提出しなければなりません。
④ 個人情報の閲覧および処理停止要求は、個人情報保護法第35条第4項、第37条第2項により情報主体の権利が制限されることがあります。
⑤ 個人情報の訂正及び削除要求は、他の法令でその個人情報が収集対象として明示されている場合には、その削除を要求することはできません。 
⑥ 病院は、情報主体の権利に応じた閲覧の要求、訂正·削除の要求、処理停止の要求時の閲覧などの要求をした者が本人であるか正当な代理人であるかを確認します。

第6条（処理する個人情報項目）病院は、次の個人情報項目を処理しています。
1.ホームページ利用者管理
氏名、14歳以上該当するかどうか、電話番号、メールアドレス
財貨またはサービス提供
必須項目:氏名、生年月日、性別、住所、電話番号、メールアドレス、決済情報(クレジットカード情報など)
選択項目:関心施術分野、過去の施術経験、過去の病歴、服用薬品情報、アレルギー反応の有無
役職員及び提携会社の管理
必須項目:<役職員及び志願者>氏名、生年月日、住所、連絡先、経歴情報
<提携会社担当者>氏名、連絡先、職場、担当業務
選択項目:<役職員>病院出入りのための指紋
インターネットサービス利用過程でIPアドレス、クッキー、MACアドレス、サービス利用記録、訪問記録が自動的に生成され収集できます。

第7条（個人情報の破棄）①病院は、個人情報の保有期間の経過、処理目的の達成など、個人情報が不要になったときは、遅滞なく当該個人情報を破棄します。
② 情報主体から同意を得た個人情報保有期間が経過し、又は処理目的が達成されたにもかかわらず、法令により個人情報を保存し続けなければならない場合には、当該個人情報を別途のデータベース(DB)に移したり、保管場所を別に保存します。
③ 個人情報破棄の手続きおよび方法は次のとおりです。
1.破棄手続き
病院は破棄事由が発生した個人情報を選定し、<個人情報処理者名>の個人情報保護責任者の承認を得て個人情報を破棄します。
破棄方法
病院は電子ファイルの形で記録·保存された個人情報は記録を再生できないように破棄し、紙文書に記録·保存された個人情報は粉砕機で粉砕または焼却して破棄します。

第8条（個人情報の安全性確保措置）病院は、個人情報の安全性確保のために次のような措置を取っています。
1.管理的措置:内部管理計画の樹立·施行、定期的な職員教育など
2.技術的措置:個人情報処理システム等のアクセス権限管理、アクセス制御システムの設置、固有識別情報等の暗号化、セキュリティプログラムの設置
3.物理的措置:電算室、資料保管室などのアクセス制御

第9条（個人情報自動収集装置の設置·運営及び拒否に関する事項）
① 病院は利用者に個別のオーダーメードサービスを提供するために利用情報を保存し、随時読み込む「クッキー(cookie)」を使用します。
② クッキーはウェブサイトを運営するのに利用されるサーバー(http)が利用者のコンピューターなど機器ブラウザに送る少量の情報で、利用者の機器に保存されることもあります。
A. クッキーの使用目的:利用者が訪問した各サービスとウェブサイトに対する訪問および利用形態、人気検索語、セキュリティ接続有無などを把握し、利用者に最適化された情報提供のために使用されます。
B. クッキーのインストール·運営及び拒否:ウェブブラウザ上段のツール>インターネットオプション>個人情報メニューのオプション設定により、クッキーの保存を拒否することができます。
C. クッキーの保存を拒否する場合、カスタマイズされたサービスの利用が困難になることがあります。

第10条（個人情報保護責任者）
① 病院は個人情報処理に関する業務を総括して責任を負い、個人情報処理に関する情報主体の苦情処理及び被害救済等のために以下のように個人情報
保護責任者を指定しています。
② 情報主体は病院のサービス(または事業)を利用する際に発生したすべての個人情報保護に関するお問い合わせ、苦情処理、被害救済などに関する事項を個人情報保護責任者および担当部署にお問い合わせいただけます。 病院は情報主体の問い合わせに対し、遅滞なく回答および処理いたします。

第11条（追加利用·提供判断基準）病院は、「個人情報保護法」第15条第3項及び第17条第4項に基づき、「個人情報保護法施行令」第14条の2に基づく事項を考慮し、情報主体の同意なしに個人情報を追加で利用·提供することができます。
これに伴い、病院が情報主体の同意なしに追加利用·提供をするために次のような事項を考慮しました。
個人情報を追加で利用·提供しようとする目的が当初の収集目的と関連があるかどうか
個人情報を収集した情況または処理慣行に照らして、追加的な利用·提供に対する予測可能性があるかどうか
個人情報の追加利用·提供が情報主体の利益を不当に侵害しているかどうか
仮名処理又は暗号化等の安全性確保に必要な措置をしたか否か

第12条（個人情報閲覧請求） 情報主体は、「個人情報保護法」第35条による個人情報閲覧請求を第10条の個人情報担当部署にすることができます。

第13条(権益侵害救済方法) 情報主体は個人情報侵害による救済を受けるために個人情報紛争調停委員会、韓国インターネット振興院個人情報侵害申告センターなどに紛争解決や相談などを申請することができます。 その他、その他の個人情報侵害の届出、相談については、以下の機関にお問い合わせください。
1.個人情報紛争調停委員会:（局番なし）1833-6972（www.kopico.go.kr ）
2.個人情報侵害申告センター:(局番なし)118 (privacy.kisa.or.kr )
3.最高検察庁:（局番なし）1301（www.spo.go.kr ）
4.警察庁:（局番なし）182（cyberbureau.police.go.kr ）

第14条（映像情報処理機器の設置·運営）①病院は以下のように映像情報処理機器を設置·運営しています。
1.映像情報処理機器設置根拠·目的:病院の施設安全·火災予防
2.設置台数、設置位置、撮影範囲:病院の診療室、廊下等に5台設置し、当該空間の全範囲を撮影
3.管理責任者、担当者及び映像情報へのアクセスを勧告した者
管理責任者兼担当者: パク·ギボム代表院長
映像情報アクセス権漢字:(株)メディクラウド運営チーム、(株)エスワン
映像情報撮影時間、保管期間、保管場所、処理方法
撮影時間:24時間撮影
保管期間 : 撮影時から7日
保管場所及び処理方法:映像情報処理機器統制室に保管·処理
映像情報の確認方法及び場所:第10条の個人情報担当部署に要請
情報主体の映像情報閲覧等要求についてした措置:個人映像情報閲覧·存在確認請求書で申請しなければならず、情報主体自身が撮影された場合、または明らかに情報主体の生命·身体·財産利益のために必要な場合に限り閲覧を許可する
映像情報保護のための技術的·管理的·物理的措置:内部管理計画樹立、アクセス統制およびアクセス権限制限、映像情報の安全な保存·転送技術適用、処理記録保管および偽造·変造防止措置、保管施設準備およびロック装置設置など

第15条（個人情報処理方針の適用及び変更） この個人情報処理方針は、2025.12.01から適用されます。
`

  const privacyPolicyTha = `
  นโยบายข้อมูลส่วนบุคคล
  
  มาตรา 1 (วัตถุประสงค์ในการประมวลผลข้อมูลส่วนบุคคล)
  Peche Clinic (ต่อไปนี้เรียกว่า ""โรงพยาบาล"") ประมวลผลข้อมูลส่วนบุคคลเพื่อวัตถุประสงค์ดังต่อไปนี้ ข้อมูลส่วนบุคคลที่ได้รับการจัดการจะไม่ใช้เพื่อวัตถุประสงค์อื่นนอกเหนือจากวัตถุประสงค์ต่อไปนี้
  ในกรณีที่มีการเปลี่ยนแปลง ｢พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล｣ มีแผนจะดำเนินการตามมาตรการที่จำเป็นเช่นการได้รับความยินยอมแยกต่างหากตามมาตรา 18
  1. การจัดการผู้ใช้โฮมเพจ
  การระบุและจัดการผู้ใช้โฮมเพจ การป้องกันการใช้งานที่ไม่เป็นธรรม และวัตถุประสงค์ของการแจ้งและการแจ้งเตือนต่างๆ
  2. การจัดหาสินค้าหรือบริการ 
  วัตถุประสงค์ของการจองการรักษาพยาบาล การให้คำปรึกษา การตรวจสอบข้อมูล เช่น บันทึกทางการแพทย์ การให้เนื้อหาที่เกี่ยวข้องกับสุขภาพ การให้บริการที่กำหนดเอง การเรียกเก็บค่าธรรมเนียม การดำเนินการด้านการตลาด โปรโมชั่น อีเว้นท์ การระบุตัวตนและการร้องเรียนของประชาชน และการจัดการเรื่องร้องเรียน
  3.ผู้บริหารและพนักงานของบริษัทในเครือ 
  วัตถุประสงค์ของการจ้างพนักงาน การจัดการพนักงาน บริษัทรับฝากและพาร์ทเนอร์
  
  มาตรา 2 (ประมวลข้อมูลส่วนบุคคลและระยะเวลาเก็บรักษา) 
  ① โรงพยาบาลจัดการและเก็บรักษาข้อมูลส่วนบุคคลภายในระยะเวลาการเก็บรักษาและใช้ข้อมูลส่วนบุคคลที่ได้รับความยินยอมเมื่อรวบรวมข้อมูลส่วนบุคคลจากตัวแทนข้อมูลตามกฎเกณฑ์
  ② แต่ละการประมวลผลข้อมูลส่วนบุคคลและระยะเวลาการเก็บรักษาเป็นดังนี้
  1.การจัดการผู้ใช้โฮมเพจ : 5 ปี นับตั้งแต่สิ้นสุดความสัมพันธ์ทางการค้า
  อย่างไรก็ตามหากสอดคล้องกับเหตุผลดังต่อไปนี้จนกว่าจะถึงเวลาที่สิ้นสุดของเหตุผลดังกล่าว
  1) หากมีการสอบสวนและสอบสวนเกี่ยวกับการกระทำที่ผิดกฎหมายอยู่จนกว่าการสอบสวนและการสอบสวนที่เกี่ยวข้อง
  2) หากความสัมพันธ์ระหว่างพันธบัตรและหนี้สินยังคงอยู่จนกว่าความสัมพันธ์ระหว่างพันธบัตรและหนี้ที่เกี่ยวข้องจะได้รับการชำระ
  2. สินค้าหรือบริการ : 5 ปี นับตั้งแต่สิ้นสุดความสัมพันธ์ทางการค้า
  อย่างไรก็ตาม หากสอดคล้องกับเหตุผลดังต่อไปนี้จนกว่าจะถึงสิ้นระยะเวลาที่เกี่ยวข้อง
  1) บันทึกเกี่ยวกับการทำธุรกรรม เช่น การแสดงโฆษณา เนื้อหาของสัญญา และการปฏิบัติตามพระราชบัญญัติคุ้มครองผู้บริโภคอีคอมเมิร์ซ ฯลฯ
  - บันทึกการแสดงผลและโฆษณา : 6 เดือน
  - บันทึกการจัดหา เช่น การถอนสัญญาหรือการทำสัญญาสั่งจองล่วงหน้า การชำระเงิน บริการ ฯลฯ : 5 ปี
  - ผู้บริโภค บันทึกการร้องเรียนหรือการจัดการข้อพิพาท: 3 ปี
  2)การจัดเก็บข้อมูลยืนยันข้อเท็จจริงในการสื่อสารตามพระราชบัญญัติคุ้มครองความลับการสื่อสาร
  - ข้อมูลการติดตามสถานที่ตั้งของสถานีฐานแหล่งกำเนิดไฟฟ้า, เวลาเปิด/ปิด, หมายเลขสมาชิกฝ่ายตรงข้าม, จำนวนการใช้งาน: 1 ปี
  - การสื่อสารทางคอมพิวเตอร์ ข้อมูลบันทึกทางอินเทอร์เน็ต ข้อมูลติดตามการเข้าถึง: 3 เดือน
  3) การเก็บรักษาบันทึกทางการแพทย์ตามพระราชบัญญัติการรักษาพยาบาล
  - รายชื่อผู้ป่วย: 5 ปี
  - ประวัติการรักษาพยาบาล : 10 ปี
  - ใบสั่งยา : 2 ปี
  - สถิติการทำหัตถการ: 10 ปี
  - เนื้อหาในการสอบและบันทึกผลการสอบ : 5 ปี
  - การถ่ายภาพรังสี (รวมถึงภาพ) และผลการค้นพบ: 5 ปี
  - บันทึกพยาบาล : 5 ปี
  - สำเนาใบตรวจโรค ฯลฯ : 3 ปี
  - อย่างไรก็ตาม หากจำเป็นสำหรับการรักษาอย่างต่อเนื่องให้ขยายระยะเวลาดังกล่าวเพียงครั้งเดียวการเก็บรักษาไว้
  3.ผู้บริหารและพนักงานของบริษัทในเครือ 
  - ข้อมูลผู้บริหารและพนักงาน: 3 ปีนับจากเกษียณอายุ
  - ข้อมูลผู้สมัคร : 1 ปี นับแต่วันสิ้นสุดการรับสมัคร
  - ข้อมูลผู้รับผิดชอบบริษัทในเครือและบริษัทร่วมทุน : 5 ปี นับตั้งแต่สิ้นสุดความสัมพันธ์ทางการค้า
  
  มาตรา 3 (การให้ข้อมูลส่วนบุคคลแก่บุคคลที่สาม) โรงพยาบาลจะประมวลผลข้อมูลส่วนบุคคลของบุคคลที่เกี่ยวข้องภายในขอบเขตที่ระบุไว้ในมาตรา 1 (วัตถุประสงค์ในการประมวลผลข้อมูลส่วนบุคคล) และ ｢พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล เช่น ความยินยอมของบุคคลที่เกี่ยวข้องและกฎระเบียบพิเศษของกฎหมาย｣ ในกรณีที่สอดคล้องกับมาตรา 17 และ 18 เท่านั้น ข้อมูลส่วนบุคคลจะถูกจัดหาให้แก่บุคคลที่สาม
  
  มาตรา 4 (มอบหมายการจัดการข้อมูลส่วนบุคคล) (1) โรงพยาบาลมีหน้าที่รับผิดชอบในการจัดการข้อมูลส่วนบุคคล ดังนี้
  
  ② เมื่อโรงพยาบาลลงนามในสัญญาการจัดส่ง ｣พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล｢ ตามมาตรา 26 ระบุความรับผิดชอบในเอกสารเช่นการห้ามการจัดการข้อมูลส่วนบุคคลนอกเหนือจากวัตถุประสงค์ของการดำเนินการจัดส่งมาตรการคุ้มครองทางเทคนิคและการจัดการข้อจำกัดในการส่งมอบใหม่การจัดการและการกำกับดูแลความเสียหายเกี่ยวกับผู้รับฝากและดูแลว่าผู้รับฝากจัดการข้อมูลส่วนบุคคลอย่างปลอดภัยหรือไม่
  ③ หากเนื้อหาของงานมอบหมายหรือการเปลี่ยนแปลงผู้ดูแลจะเปิดเผยผ่านนโยบายการจัดการข้อมูลส่วนบุคคลนี้โดยไม่ชักช้า
  
  มาตรา 5 (สิทธิ หน้าที่ และวิธีการใช้ของผู้ให้ข้อมูลและตัวแทนตามกฎหมาย) (1) ผู้ให้ข้อมูลสามารถใช้สิทธิเช่นการร้องขอการตรวจสอบ แก้ไข ลบ หรือระงับข้อมูลส่วนบุคคลสำหรับโรงพยาบาลได้ตลอดเวลาค่ะ
  ② การใช้สิทธิตามวรรค 1 สามารถทำได้ผ่านจดหมาย อีเมล ฯลฯ ตามมาตรา 41 วรรค 1 ของพระราชกฤษฎีกาบังคับใช้ของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล และโรงพยาบาลจะดำเนินการโดยไม่ชักช้าค่ะ
  ③ การใช้สิทธิตามวรรค 1 สามารถทำได้ผ่านตัวแทนเช่นตัวแทนตามกฎหมายหรือผู้ที่ได้รับมอบหมายจากผู้ให้ข้อมูลค่ะ ในกรณีนี้ ต้องส่งหนังสือมอบอำนาจตามแบบฟอร์มที่แนบมา 11 ""ประกาศเกี่ยวกับวิธีการจัดการข้อมูลส่วนบุคคล"" ค่ะ
  ④ การเรียกร้องให้หยุดอ่านและการประมวลผลข้อมูลส่วนบุคคลอาจจำกัดสิทธิของผู้ให้ข้อมูลตามมาตรา 35 วรรค 4 และมาตรา 37 วรรค 2 ของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคลค่ะ
  ⑤ การร้องขอแก้ไขและลบข้อมูลส่วนบุคคลไม่สามารถเรียกร้องการลบได้หากข้อมูลส่วนบุคคลถูกระบุไว้ในกฎหมายอื่นเป็นเป้าหมายในการรวบรวมค่ะ
  ⑥ โรงพยาบาลจะตรวจสอบว่าบุคคลที่ร้องขอเช่นความต้องการในการอ่านตามสิทธิของผู้ให้ข้อมูล, ความต้องการในการแก้ไขหรือลบ, การอ่านตามคำขอระงับการประมวลผล เป็นต้นนั้นเป็นบุคคลหรือตัวแทนที่เหมาะสมค่ะ
  
  มาตรา 6 (รายการข้อมูลส่วนบุคคลที่จัดการ) โรงพยาบาลจะดำเนินการรายการข้อมูลส่วนบุคคลดังต่อไปนี้
  1. การจัดการผู้ใช้โฮมเพจ
  ชื่อ, อายุตั้งแต่ 14 ปีขึ้นไป, เบอร์โทรศัพท์, ที่อยู่อีเมล์
  2. การจัดหาสินค้าหรือบริการ.
  รายการจำเป็น: ชื่อ วันเกิด เพศ ที่อยู่ เบอร์โทรศัพท์ ที่อยู่อีเมล์ ข้อมูลการชำระเงิน (เช่น ข้อมูลบัตรเครดิต เป็นต้น)
  ตัวเลือก: สาขาวิชาที่สนใจ, ประสบการณ์การผ่าตัดในอดีต, ประวัติการรักษาในอดีต, ข้อมูลยาที่ใช้, อาการแพ้หรือไม่
  3. ผู้บริหารและพนักงานและการจัดการบริษัทในเครือ.
  รายการที่จำเป็น: <พนักงานและผู้สมัคร> ชื่อ วันเกิด ที่อยู่ เบอร์ติดต่อ ข้อมูลอาชีพ
  <พนักงานบริษัท> ชื่อ, เบอร์ติดต่อ, ที่ทำงาน,
  เลือกรายการ: <พนักงาน> ลายนิ้วมือเพื่อเข้าและออกโรงพยาบาล
  4. สามารถสร้างและรวบรวมที่อยู่ IP, คุกกี้, ที่อยู่ MAC, บันทึกการใช้บริการ, บันทึกการเยี่ยมชมโดยอัตโนมัติในกระบวนการใช้บริการอินเทอร์เน็ตค่ะ
  
  มาตรา 7 (การทำลายข้อมูลส่วนบุคคล)  โรงพยาบาลจะยกเลิกข้อมูลส่วนบุคคลโดยไม่รอช้าหากข้อมูลส่วนบุคคลไม่จำเป็น เช่น การหมดอายุของระยะเวลาการเก็บรักษาข้อมูลส่วนบุคคล การบรรลุวัตถุประสงค์ในการประมวลผล เป็นต้น
  ② หากระยะเวลาการเก็บรักษาข้อมูลส่วนบุคคลที่ได้รับความยินยอมจากตัวแทนข้อมูลหรือหากจำเป็นต้องเก็บรักษาข้อมูลส่วนบุคคลอย่างต่อเนื่องตามกฎหมายและกฎหมายแม้ว่าจะบรรลุวัตถุประสงค์ในการประมวลผล ข้อมูลส่วนบุคคลจะถูกย้ายไปยังฐานข้อมูลแยกต่างหาก(DB)หรือสถานที่จัดเก็บข้อมูลที่แตกต่างกันค่ะ
  ③ ขั้นตอนและวิธีการทำลายข้อมูลส่วนบุคคลมีดังต่อไปนี้
  1.ขั้นตอนการรื้อถอน
  โรงพยาบาลเลือกข้อมูลส่วนบุคคลที่มีเหตุผลในการทำลายและยกเลิกข้อมูลส่วนบุคคลโดยได้รับการอนุมัติจากเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของ <ชื่อผู้ประมวลผลข้อมูลส่วนบุคคล>
  2. วิธีการรื้อถอน.
  โรงพยาบาลทำลายข้อมูลส่วนบุคคลที่บันทึกและจัดเก็บในรูปแบบไฟล์อิเล็กทรอนิกส์เพื่อไม่ให้สามารถเล่นบันทึกได้ และข้อมูลส่วนบุคคลที่บันทึกไว้ในเอกสารกระดาษจะถูกบดหรือเผาด้วยเครื่องบด
  
  มาตรา 8 (มาตรการรักษาความปลอดภัยของข้อมูลส่วนบุคคล) โรงพยาบาลมีมาตรการดังต่อไปนี้เพื่อความปลอดภัยของข้อมูลส่วนบุคคล
  1. มาตรการบริหารจัดการ : จัดทำและดำเนินการแผนการบริหารภายใน การฝึกอบรมพนักงานประจำ เป็นต้น
  2.มาตรการทางเทคนิค : การจัดการที่เข้าถึงได้ เช่น ระบบประมวลผลข้อมูลส่วนบุคคล การติดตั้งระบบควบคุมการเข้าถึง การเข้ารหัสข้อมูลจำเพาะ การติดตั้งโปรแกรมรักษาความปลอดภัย
  3.มาตรการทางกายภาพ : ควบคุมการเข้าถึง เช่น ห้องคอมพิวเตอร์ ห้องเก็บข้อมูล เป็นต้น
  
  มาตรา 9 (เกี่ยวกับการติดตั้ง การดำเนินงาน และการปฏิเสธการรวบรวมข้อมูลส่วนบุคคลโดยอัตโนมัติ) 
  ① โรงพยาบาลใช้ 'คุกกี้' ที่เก็บข้อมูลการใช้งานและโหลดบ่อยๆเพื่อให้บริการที่กำหนดเองแก่ผู้ใช้แต่ละราย
  ② คุกกี้เป็นข้อมูลจำนวนเล็กน้อยที่เซิร์ฟเวอร์(http)ที่ใช้ในการดำเนินการเว็บไซต์ถูกส่งไปยังเบราว์เซอร์อุปกรณ์เช่นคอมพิวเตอร์ของผู้ใช้และจะถูกเก็บไว้ในอุปกรณ์ของผู้ใช้ค่ะ
  ก. วัตถุประสงค์ของการใช้คุกกี้: ใช้เพื่อระบุบริการและรูปแบบการใช้งานของแต่ละเว็บไซต์ที่ผู้ใช้เยี่ยมชม คำค้นหาที่ได้รับความนิยมและการเข้าถึงที่ปลอดภัย ฯลฯ และให้ข้อมูลที่เหมาะสมแก่ผู้ใช้
  การติดตั้ง การดำเนินการ และการปฏิเสธคุกกี้ : เครื่องมือที่ด้านบนของเว็บเบราว์เซอร์>ตัวเลือกอินเทอร์เน็ต> ตัวเลือกในเมนูความเป็นส่วนตัวสามารถปฏิเสธการบันทึกคุกกี้ได้
  ดา. การปฏิเสธการจัดเก็บคุกกี้อาจทำให้เกิดความยากลำบากในการใช้บริการที่กำหนดเอง
  
  มาตรา 10 (ผู้รับผิดชอบการคุ้มครองข้อมูลส่วนบุคคล) 
  ① โรงพยาบาลรับผิดชอบงานเกี่ยวกับการประมวลผลข้อมูลส่วนบุคคลอย่างทั่วถึง ข้อมูลส่วนบุคคลเพื่อการจัดการความไม่พอใจของผู้เกี่ยวข้องกับการประมวลผลข้อมูลส่วนบุคคลและการบรรเทาความเสียหาย เป็นต้น ดังนี้
  กำลังระบุตัวผู้รับผิดชอบการคุ้มครองค่ะ
  ② ผู้ให้ข้อมูลสามารถติดต่อเจ้าหน้าที่รักษาความปลอดภัยข้อมูลส่วนบุคคลและแผนกที่รับผิดชอบในการสอบถามเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคล, การจัดการร้องเรียน, การบรรเทาความเสียหาย ฯลฯ ที่เกิดขึ้นจากการใช้บริการ(หรือธุรกิจ)ของโรงพยาบาลค่ะ โรงพยาบาลจะตอบสนองและจัดการกับคำถามของผู้ให้ข้อมูลโดยไม่ชักช้า
  
  มาตรา 11 (เกณฑ์การตัดสินการใช้งานและการให้บริการเพิ่มเติม) โรงพยาบาล ｢พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล｣ ตามมาตรา 15 วรรค 3 และ 17 วรรค 4 ｣พระราชกฤษฎีกาบังคับใช้ของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล｢ เมื่อพิจารณาตามข้อ 2 ของมาตรา 14 สามารถใช้และให้ข้อมูลส่วนบุคคลเพิ่มเติมได้โดยไม่ได้รับความยินยอมจากผู้ให้ข้อมูลค่ะ
  ดังนั้นโรงพยาบาลจึงพิจารณาเรื่องดังต่อไปนี้เพื่อให้บริการเพิ่มเติมโดยไม่ได้รับความยินยอมจากผู้ให้ข้อมูลค่ะ
  ว่าวัตถุประสงค์ในการใช้และจัดหาข้อมูลส่วนบุคคลเพิ่มเติมมีความเกี่ยวข้องกับวัตถุประสงค์ในการเก็บรวบรวมหรือไม่
  - ไม่ว่าจะเป็นไปได้ที่จะคาดการณ์การใช้และการจัดหาเพิ่มเติมเมื่อพิจารณาจากสถานการณ์หรือพฤติกรรมการประมวลผลที่รวบรวมข้อมูลส่วนบุคคล
  - ไม่ว่าการใช้และการจัดหาข้อมูลส่วนบุคคลเพิ่มเติมจะละเมิดผลประโยชน์ของผู้ให้ข้อมูลอย่างไม่ยุติธรรมหรือไม่
  - ไม่ว่าจะมีมาตรการที่จำเป็นสำหรับการรักษาความปลอดภัย เช่น การประมวลผลนามแฝงหรือการเข้ารหัสหรือไม่
  
  มาตรา 12 (การร้องขออ่านข้อมูลส่วนบุคคล) ｢พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล｣ การร้องขออ่านข้อมูลส่วนบุคคลตามมาตรา 35 สามารถดำเนินการกับแผนกประกันส่วนบุคคลมาตรา 10 ค่ะ
  
  ผู้ให้ข้อมูลมาตรา 13 (วิธีการแก้ไขการละเมิดสิทธิ) สามารถยื่นคำร้องต่อคณะกรรมการประสานงานข้อพิพาทข้อมูลส่วนบุคคลและศูนย์รายงานการละเมิดข้อมูลส่วนบุคคลของสำนักงานส่งเสริมอินเทอร์เน็ตเกาหลี ฯลฯ เพื่อรับการช่วยเหลือจากการละเมิดข้อมูลส่วนบุคคล นอกจากนี้โปรดติดต่อหน่วยงานด้านล่างเพื่อแจ้งและให้คำปรึกษาเกี่ยวกับการละเมิดข้อมูลส่วนบุคคลอื่นๆ
  1.คณะกรรมการไกล่เกลี่ยข้อพิพาทข้อมูลส่วนบุคคล : (ไม่มีรหัสประเทศ) 1833-6972 (www.kopico.go.kr )
  2.ศูนย์แจ้งการละเมิดข้อมูลส่วนบุคคล : (ไม่มีรหัสประเทศ) 118 (privacy.kisa.or.kr )
  3.สำนักงานอัยการสูงสุด : (ไม่มีรหัสประเทศ) 1301 (www.spo.go.kr )
  4.สำนักงานตำรวจแห่งชาติ : (ไม่มีรหัสประเทศ) 182 (cyberbureau.police.go.kr )
  
  มาตรา 14 (ติดตั้งและดำเนินการอุปกรณ์ประมวลผลข้อมูลวิดีโอ)  병원은 โรงพยาบาลได้ติดตั้งและดำเนินการอุปกรณ์ประมวลผลข้อมูลวิดีโอดังต่อไปนี้
  1.พื้นฐานและวัตถุประสงค์ในการติดตั้งอุปกรณ์ประมวลผลข้อมูลภาพ : ความปลอดภัยของสิ่งอำนวยความสะดวกของโรงพยาบาลและการป้องกันอัคคีภัย
  2.ติดตั้งกล้องวงจรปิด จำนวน 5 ตัว ตำแหน่งที่ตั้ง และขอบเขตการถ่ายภาพ : ติดตั้งในห้องพยาบาล ห้องโถง ฯลฯ เพื่อถ่ายภาพพื้นที่ทั้งหมด
  3.เจ้าหน้าที่ธุรการ ผู้มีอำนาจเข้าถึงข้อมูลภาพ
  - ผู้จัดการและผู้รับผิดชอบ: ประธานพัค คีบอม
  - ผู้มีสิทธิ์เข้าถึงข้อมูลวิดีโอ: บริษัท มีเดียคลาวด์ จำกัด, บริษัท เอสวัน จำกัด
  4. เวลาในการถ่ายข้อมูลวิดีโอ ระยะเวลาในการจัดเก็บ สถานที่จัดเก็บ วิธีการประมวลผล
  - เวลาถ่ายทำ : ถ่ายทำ 24 ชั่วโมง
  - ระยะเวลาการเก็บรักษา : 7 วันนับจากวันที่ถ่ายทำ
  - สถานที่จัดเก็บและวิธีการประมวลผล : เก็บและประมวลผลข้อมูลภาพในห้องควบคุม
  5. วิธีการตรวจสอบข้อมูลภาพและสถานที่ : ขอต่อกรมข้อมูลส่วนบุคคลตามมาตรา 10
  6. เพื่อตอบสนองความต้องการ เช่น การอ่านข้อมูลวิดีโอของผู้ให้ข้อมูลมาตรการหนึ่ง: ต้องยื่นคำร้องต่อใบเรียกเก็บเงินสำหรับการดูและยืนยันการมีอยู่ของข้อมูลส่วนบุคคลและอนุญาตให้อ่านเฉพาะเมื่อผู้ให้ข้อมูลถ่ายภาพหรือเห็นได้ชัดว่าจำเป็นเพื่อประโยชน์ต่อชีวิต ร่างกาย และทรัพย์สินของผู้ให้ข้อมูล
  7. มาตรการทางเทคนิค การบริหารจัดการ และทางกายภาพในการปกป้องข้อมูลภาพ : การจัดทำแผนการจัดการภายใน, การควบคุมเข้าถึงและการจำกัดสิทธิ์ในการเข้าถึง, การนำเทคโนโลยีการจัดเก็บและถ่ายทอดข้อมูลภาพอย่างปลอดภัย, การจัดเก็บและป้องกันการปลอมแปลง, การติดตั้งระบบจัดเก็บข้อมูลและการล็อค เป็นต้น
  
  มาตรา 15 (การประยุกต์ใช้และการเปลี่ยนแปลงนโยบายการประมวลผลข้อมูลส่วนบุคคล) ""นโยบายการจัดการข้อมูลส่วนบุคคลนี้จะมีผลบังคับใช้ตั้งแต่วันที่ 29 มีนาคม พ.ศ. 2564""
`

  useEffect(() => {
    if (language === Language.KOR) {
      setPrivacyPolicy(privacyPolicyKor)
    } else if (language === Language.ENG) {
      setPrivacyPolicy(privacyPolicyEng)
    } else if (language === Language.CHN) {
      setPrivacyPolicy(privacyPolicyChn)
    } else if (language === Language.TWN) {
      setPrivacyPolicy(privacyPolicyTwn)
    } else if (language === Language.JPN) {
      setPrivacyPolicy(privacyPolicyJpn)
    } else if (language === Language.THA) {
      setPrivacyPolicy(privacyPolicyTha)
    }
  }, [language])

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <div tw="flex justify-center mt-4 px-4 mb-9" style={{ whiteSpace: "pre-line" }}>
        {privacyPolicy}
      </div>
    </Page>
  )
}

export default PrivacyPolicy
