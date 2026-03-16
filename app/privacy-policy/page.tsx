export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to SpeedFix. We are committed to protecting your privacy and
        ensuring transparency in how we collect and use your information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Service address</li>
        <li>Location data (if enabled)</li>
        <li>Booking details and service history</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To connect customers with technicians and service providers</li>
        <li>To process service bookings</li>
        <li>To improve user experience</li>
        <li>To send booking confirmations and updates</li>
        <li>To provide customer support</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Payment Processing
      </h2>
      <p className="mb-4">
        All payments on SpeedFix are securely processed through Razorpay.
        SpeedFix does not store your full card details or banking information.
        Transactions are encrypted and handled by Razorpay's secure payment
        infrastructure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Third-Party Services
      </h2>
      <p className="mb-4">
        We use trusted third-party services such as Firebase (authentication
        and backend services) and Razorpay (payment processing). These
        providers follow industry-standard security practices.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Data Protection
      </h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to
        protect your personal data from unauthorized access, misuse, or
        disclosure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. User Rights
      </h2>
      <p className="mb-4">
        You may request access, correction, or deletion of your personal data
        by contacting us at the email provided below.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Contact Information
      </h2>
      <p>
        For any privacy-related questions, contact us at:
        <br />
        <strong>support@speedfix.co.in</strong>
      </p>
    </div>
  );
}