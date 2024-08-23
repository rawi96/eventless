import Image from 'next/image';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import backgroundImage from '@/images/background-call-to-action.jpg';

export function CallToAction() {
  return (
    <section id="get-started-today" className="relative overflow-hidden bg-blue-600 py-32">
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Transform Your Event Management Today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Elevate your events with our all-in-one platform. Sign up now and unlock powerful tools to streamline your
            operations and engage your audience.
          </p>
          <Button color="white" className="mt-10">
            Start Your Free Trial
          </Button>
        </div>
      </Container>
    </section>
  );
}
