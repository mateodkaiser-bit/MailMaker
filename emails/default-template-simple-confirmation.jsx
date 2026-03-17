import { Html, Head, Body, Container, Section, Text } from '@react-email/components';

export const subject = "You are now subscribed!";

export default function DefaultTemplateSimpleConfirmation() {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Section style={{ padding: '30px 0 0 0', margin: 0 }} />
      <Text
        style={{ fontSize: '24px', fontWeight: 700, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Thank you for subscribing" }}
      />
      <Section style={{ padding: '30px 0 0 0', margin: 0 }} />
      <Text
        style={{ textAlign: 'center', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "<span style=\"color:#676a6c\">You have just subscribed to our list.</span>" }}
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
