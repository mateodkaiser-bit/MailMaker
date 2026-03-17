import { Html, Head, Body, Container, Text } from '@react-email/components';

export const subject = "Swarmed for Midwest Beekeepers Association";

export default function WelcomeEmailAssociationFollowUpInvite({
  beekeepername = "Jane Doe",
  beekeeperassociation = "Midwest Beekeepers Association",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `Hi ${beekeepername},` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `Thanks again for signing up for Swarmed. I noticed that you're a part of ${beekeeperassociation}.` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "I wanted to reach out to you because joining Swarmed with your association is the best way to get more swarms reported in your area and help your group thrive. <br/> " }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "To see how Swarmed integrates with associations from Hawaii to New Hampshire to make swarm reporting easier, faster, and more private, you can visit our <a href=\"https://beeswarmed.org/partnerships\">Partnerships</a> page. I also wanted to send you a presentation about Swarmed for Associations that you're more than welcome to share with your association. You can find that <a href=\"https://www.canva.com/design/DAGcvN6pIcE/kdWJZfJNAx-IxyGYc8lswA/view?utm_content=DAGcvN6pIcE&utm_campaign=designshare&utm_medium=link&utm_source=recording_view\">here</a>." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thanks," }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "<br/>Mateo" }}
      />
        </Container>
      </Body>
    </Html>
  );
}
