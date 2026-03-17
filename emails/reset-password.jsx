import { Html, Head, Body, Container, Button } from '@react-email/components';

export const subject = "Reset Your Swarmed Password";

export default function ResetPassword({
  resetlink = "https://swarmwatch.example.org/reset-password?token=def456",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Button
        href={resetlink}
        style={{
          backgroundColor: '#091747',
          color: '#ffffff',
          borderRadius: '4px',
          padding: '12px 24px 12px 24px',
          fontSize: '16px',
          fontWeight: 600,
          textAlign: 'center',
          display: 'block',
        }}
      >
        Reset Your Password
      </Button>
        </Container>
      </Body>
    </Html>
  );
}
