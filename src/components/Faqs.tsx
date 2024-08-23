import Image from 'next/image';

import { Container } from '@/components/Container';
import backgroundImage from '@/images/background-faqs.jpg';

const faqs = [
  [
    {
      question: 'What types of events can Eventless manage?',
      answer: 'Eventless is versatile and can handle everything from small meetings to large conferences and festivals.',
    },
    {
      question: 'Can I integrate Eventless with other tools?',
      answer:
        'Yes, Eventless integrates with a variety of tools including CRM systems, email marketing platforms, and social media channels.',
    },
    {
      question: 'How do I customize my event registration form?',
      answer:
        'You can easily customize your registration forms through our user-friendly dashboard, allowing you to add fields and tailor the form to your event’s needs.',
    },
  ],
  [
    {
      question: 'Is there a mobile app for managing events?',
      answer:
        'Yes, Eventless offers a mobile app so you can manage your events on the go, with features for real-time updates and attendee management.',
    },
    {
      question: 'What support options are available?',
      answer:
        'We offer comprehensive support through email, live chat, and phone. For premium plans, dedicated support is also available.',
    },
    {
      question: 'Can Eventless handle ticketing and payments?',
      answer:
        'Absolutely. Eventless provides integrated ticketing solutions with various payment options to streamline the registration process for your attendees.',
    },
  ],
  [
    {
      question: 'How do I track event performance?',
      answer:
        'Eventless offers detailed analytics and reporting features to track key performance indicators, attendee engagement, and more.',
    },
    {
      question: 'Are there any setup fees?',
      answer: 'No, Eventless does not charge setup fees. You only pay for the plan that best suits your event needs.',
    },
    {
      question: 'Can I schedule a demo of Eventless?',
      answer:
        'Yes, you can schedule a demo with one of our representatives to see Eventless in action and get answers to any specific questions you may have.',
    },
  ],
];

export function Faqs() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-hidden bg-slate-50 py-20 sm:py-32">
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 id="faq-title" className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you have more questions or need further assistance, please reach out to our support team for help.
          </p>
        </div>
        <ul role="list" className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">{faq.question}</h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
