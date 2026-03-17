import { Html, Head, Body, Container, Img, Link, Text } from '@react-email/components';

export const subject = "Your Request to Join Midwest Beekeepers Association on Swarmed Has Been Sent";

export default function AssociationMembershipPending({
  beekeepername = "Jane Doe",
  beekeeperassociation = "Midwest Beekeepers Association",
  beekeeperassociationemail = "contact@midwestbeekeepers.org",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link href="https://beeswarmed.org/">
        <Img
          src="https://img.mailinblue.com/8333748/images/content_library/original/673f42266d8c7e0c4e5bf738.png"
          alt=""
          width="300px"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </Link>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `Hi ${beekeepername},` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `Your request to join ${beekeeperassociation} on Swarmed has been successfully shared with the group administrator(s).` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "We'll let you know once your request to join has been reviewed." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `In the meantime, you'll still receive notifications of colonies reported through Swarmed. Once you're approved, you'll also receive notifications of colonies reported via ${beekeeperassociation}.` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `If you have questions about your request, please contact ${beekeeperassociation} at ${beekeeperassociationemail}` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thanks," }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Mateo from Swarmed" }}
      />
        </Container>
      </Body>
    </Html>
  );
}
