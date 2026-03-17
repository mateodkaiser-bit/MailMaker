import { Html, Head, Body, Container, Button } from '@react-email/components';

export const subject = "Midwest Beekeepers Association has invited you to join them on Swarmed";

export default function AssociationMemberInvite({
  invite = "https://swarmwatch.example.org/invite?ref=xyz789",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Button
        href={invite}
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
        Join Swarmed &amp; Accept Invite
      </Button>
        </Container>
      </Body>
    </Html>
  );
}
