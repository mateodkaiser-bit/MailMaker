import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

export const subject = "Confirm your subscription";

export default function DefaultTemplateDoubleOptInConfirmation() {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Section style={{ padding: '30px 0 0 0', margin: 0 }} />
      <Text
        style={{ fontSize: '24px', fontWeight: 700, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Please confirm your subscription" }}
      />
      <Section style={{ padding: '30px 0 0 0', margin: 0 }} />
      <Button
        href="{{ doubleoptin }}"
        style={{
          backgroundColor: '#4ca4e0',
          color: '#ffffff',
          borderRadius: '5px',
          padding: '12px 24px 12px 24px',
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'center',
          display: 'block',
        }}
      >
        Yes, subscribe me to this list
      </Button>
      <Section style={{ padding: '30px 0 0 0', margin: 0 }} />
      <Text
        style={{ textAlign: 'center', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "<span style=\"color:#676a6c\">If you have received this email by mistake, simply delete it. You will not be subscribed to our mailing list if you do not click on the confirmation link above.</span>" }}
      />
      <Section style={{ padding: '30px 0 0 0', margin: 0 }} />
      <Section style={{ padding: '40px 0 0 0', margin: 0 }} />
      <Text
        style={{ textAlign: 'center', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "<span style=\"color:#aaaaaa\">brevo</span>" }}
      />
      <Section style={{ padding: '40px 0 0 0', margin: 0 }} />
        </Container>
      </Body>
    </Html>
  );
}
