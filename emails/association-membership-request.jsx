import { Html, Head, Body, Container, Button } from '@react-email/components';

export const subject = "Jane Doe Has Requested to Join Midwest Beekeepers Association on Swarmed";

export default function AssociationMembershipRequest({
  memberslink = "https://swarmwatch.example.org/members",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Button
        href={memberslink}
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
        Manage Members
      </Button>
        </Container>
      </Body>
    </Html>
  );
}
