import Container from "@/components/common/Container";
import PageBreadcrumb from "@/components/common/pages/PageBreadCrumb";
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Truck, 
    RotateCcw, 
    CreditCard, 
    ShieldCheck,
    HelpCircle,
    MessageCircle,
    Package,
    Users
} from "lucide-react";
import Link from "next/link";

const HelpPage = () => {
    return (
        <Container className="py-6 sm:py-8 md:py-10">
            <PageBreadcrumb
                items={[]}
                currentPage="Help Center"
            />

            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">How Can We Help You?</h1>
                <p className="text-babyshopTextLight max-w-2xl mx-auto text-sm sm:text-base px-2">
                    Welcome to BabyMart Help Center. Find answers to common questions, 
                    learn about our policies, or get in touch with our support team.
                </p>
            </div>

            {/* Quick Help Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                <QuickHelpCard
                    icon={<Truck className="w-6 h-6 sm:w-8 sm:h-8" />}
                    title="Shipping Info"
                    description="Track orders & delivery times"
                />
                <QuickHelpCard
                    icon={<RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" />}
                    title="Returns & Refunds"
                    description="Easy 30-day return policy"
                />
                <QuickHelpCard
                    icon={<CreditCard className="w-6 h-6 sm:w-8 sm:h-8" />}
                    title="Payment Options"
                    description="Secure payment methods"
                />
                <QuickHelpCard
                    icon={<ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />}
                    title="Product Safety"
                    description="Quality & safety standards"
                />
            </div>

            {/* FAQ Section */}
            <div className="mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-babyshopSky" />
                    Frequently Asked Questions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <FAQItem
                        question="How do I track my order?"
                        answer="Once your order is shipped, you'll receive an email with a tracking number. You can also view your order status in your account under 'My Orders'."
                    />
                    <FAQItem
                        question="What is your return policy?"
                        answer="We offer a 30-day return policy for all unused items in their original packaging. Simply initiate a return from your account or contact our support team."
                    />
                    <FAQItem
                        question="How long does shipping take?"
                        answer="Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. Free shipping on orders over $100."
                    />
                    <FAQItem
                        question="Are all products baby-safe?"
                        answer="Yes! All our products meet strict safety standards and are certified for baby use. We only partner with trusted brands that prioritize safety."
                    />
                    <FAQItem
                        question="Can I change or cancel my order?"
                        answer="You can modify or cancel your order within 2 hours of placing it. After that, please contact our support team for assistance."
                    />
                    <FAQItem
                        question="Do you offer gift wrapping?"
                        answer="Yes! We offer complimentary gift wrapping on all orders. Simply select the gift wrap option during checkout."
                    />
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-babyshopLightBg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-babyshopSky" />
                    Contact Us
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <ContactCard
                        icon={<Phone className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Phone Support"
                        content="+1 (800) 123-4567"
                        subtitle="Mon-Fri, 9am-6pm EST"
                    />
                    <ContactCard
                        icon={<Mail className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Email Us"
                        content="support@babymart.com"
                        subtitle="We reply within 24 hours"
                    />
                    <ContactCard
                        icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Visit Us"
                        content="123 Baby Street"
                        subtitle="New York, NY 10001"
                    />
                    <ContactCard
                        icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Business Hours"
                        content="Mon - Fri: 9am - 6pm"
                        subtitle="Sat: 10am - 4pm"
                    />
                </div>
            </div>

            {/* Help Categories */}
            <div className="mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Browse Help Topics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <HelpTopicCard
                        icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Orders & Shipping"
                        topics={["Track Order", "Shipping Rates", "Delivery Times", "International Shipping"]}
                    />
                    <HelpTopicCard
                        icon={<RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Returns & Exchanges"
                        topics={["Return Policy", "Start a Return", "Exchange Items", "Refund Status"]}
                    />
                    <HelpTopicCard
                        icon={<CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Payments & Pricing"
                        topics={["Payment Methods", "Promo Codes", "Gift Cards", "Price Match"]}
                    />
                    <HelpTopicCard
                        icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Account & Profile"
                        topics={["Create Account", "Update Info", "Password Reset", "Order History"]}
                    />
                    <HelpTopicCard
                        icon={<ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Safety & Quality"
                        topics={["Product Safety", "Certifications", "Age Guidelines", "Recall Info"]}
                    />
                    <HelpTopicCard
                        icon={<MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                        title="Feedback & Reviews"
                        topics={["Write a Review", "Report Issue", "Suggestions", "Testimonials"]}
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-babyshopSky rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Still Need Help?</h2>
                <p className="mb-4 sm:mb-6 opacity-90 text-sm sm:text-base">
                    Our customer support team is here to assist you with any questions or concerns.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link
                        href="#"
                        className="bg-white text-babyshopSky px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
                    >
                        Start Live Chat
                    </Link>
                    <Link
                        href="#"
                        className="border-2 border-white text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-white/10 transition-colors text-sm sm:text-base"
                    >
                        Submit a Ticket
                    </Link>
                </div>
            </div>
        </Container>
    );
};

// Component: Quick Help Card
const QuickHelpCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <div className="bg-white border rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center hover:shadow-lg hover:border-babyshopSky transition-all duration-300 cursor-pointer group">
        <div className="text-babyshopSky mb-2 sm:mb-4 flex justify-center group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-babyshopTextLight">{description}</p>
    </div>
);

// Component: FAQ Item
const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
    <div className="bg-white border rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
        <h4 className="font-semibold mb-1 sm:mb-2 text-babyshopBlack text-sm sm:text-base">{question}</h4>
        <p className="text-xs sm:text-sm text-babyshopTextLight leading-relaxed">{answer}</p>
    </div>
);

// Component: Contact Card
const ContactCard = ({ icon, title, content, subtitle }: { icon: React.ReactNode; title: string; content: string; subtitle: string }) => (
    <div className="text-center">
        <div className="text-babyshopSky mb-2 sm:mb-3 flex justify-center">{icon}</div>
        <h4 className="font-medium text-xs sm:text-sm text-babyshopTextLight mb-0.5 sm:mb-1">{title}</h4>
        <p className="font-semibold text-xs sm:text-sm md:text-base truncate">{content}</p>
        <p className="text-[10px] sm:text-xs text-babyshopTextLight mt-0.5 sm:mt-1">{subtitle}</p>
    </div>
);

// Component: Help Topic Card
const HelpTopicCard = ({ icon, title, topics }: { icon: React.ReactNode; title: string; topics: string[] }) => (
    <div className="bg-white border rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="text-babyshopSky">{icon}</div>
            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
        </div>
        <ul className="space-y-1.5 sm:space-y-2">
            {topics.map((topic, index) => (
                <li key={index}>
                    <Link 
                        href="#" 
                        className="text-xs sm:text-sm text-babyshopTextLight hover:text-babyshopSky transition-colors flex items-center gap-2"
                    >
                        <span className="w-1 h-1 bg-babyshopSky rounded-full"></span>
                        {topic}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default HelpPage;