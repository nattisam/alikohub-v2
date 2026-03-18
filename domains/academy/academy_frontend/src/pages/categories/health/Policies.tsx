import { Layout } from "@/components/categories/health/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const policies = [
  {
    id: "refund",
    title: "Refund & Cancellation Policy",
    content: `
      <h4 class="font-semibold mb-2">Cancellation Before Program Start</h4>
      <p class="mb-4">Students who cancel enrollment before the program start date are entitled to a full refund of all tuition and fees paid, minus any non-refundable application fees.</p>
      
      <h4 class="font-semibold mb-2">Withdrawal During Program</h4>
      <p class="mb-4">Refunds for students who withdraw after the program begins are calculated on a prorated basis:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Withdrawal during first 25% of program: 75% refund</li>
        <li>Withdrawal during 25-50% of program: 50% refund</li>
        <li>Withdrawal after 50% of program: No refund</li>
      </ul>
      
      <h4 class="font-semibold mb-2">Refund Processing</h4>
      <p>Refunds are processed within 30 days of the official withdrawal date. Students must submit a written withdrawal request to the Registrar's office.</p>
    `,
  },
  {
    id: "attendance",
    title: "Attendance Policy",
    content: `
      <h4 class="font-semibold mb-2">Attendance Requirements</h4>
      <p class="mb-4">Students must maintain a minimum attendance rate of 90% for theory and lab sessions, and 100% for clinical rotations unless excused absences are approved.</p>
      
      <h4 class="font-semibold mb-2">Excused Absences</h4>
      <p class="mb-4">Excused absences may be granted for documented illness, family emergencies, or other circumstances approved by the Program Director. Documentation is required.</p>
      
      <h4 class="font-semibold mb-2">Make-Up Policy</h4>
      <p class="mb-4">Missed clinical hours must be made up before program completion. Make-up sessions are scheduled based on facility availability and may extend the program end date.</p>
      
      <h4 class="font-semibold mb-2">Consequences of Excessive Absences</h4>
      <p>Students who fail to meet attendance requirements may be placed on academic probation or dismissed from the program.</p>
    `,
  },
  {
    id: "grievance",
    title: "Grievance & Complaints",
    content: `
      <h4 class="font-semibold mb-2">Filing a Complaint</h4>
      <p class="mb-4">Students have the right to file complaints or grievances regarding academic matters, conduct issues, or institutional policies. All complaints are taken seriously and handled confidentially.</p>
      
      <h4 class="font-semibold mb-2">Grievance Process</h4>
      <ol class="list-decimal list-inside mb-4 space-y-1">
        <li>Submit a written complaint to the Student Services office</li>
        <li>Meeting scheduled with appropriate administrator within 5 business days</li>
        <li>Investigation conducted if necessary</li>
        <li>Written response provided within 15 business days</li>
        <li>Appeal process available if resolution is unsatisfactory</li>
      </ol>
      
      <h4 class="font-semibold mb-2">External Complaints</h4>
      <p>Students may also file complaints with the Washington Workforce Training and Education Coordinating Board if institutional processes do not resolve the issue.</p>
    `,
  },
  {
    id: "academic",
    title: "Academic Progress",
    content: `
      <h4 class="font-semibold mb-2">Grading Standards</h4>
      <p class="mb-4">Students must maintain a minimum cumulative grade of 75% (C) to remain in good academic standing. Clinical competencies must be passed with a "Satisfactory" rating.</p>
      
      <h4 class="font-semibold mb-2">Academic Probation</h4>
      <p class="mb-4">Students whose grades fall below the minimum standard are placed on academic probation. Students on probation must meet with their instructor to develop an improvement plan.</p>
      
      <h4 class="font-semibold mb-2">Dismissal</h4>
      <p class="mb-4">Students who fail to meet academic standards after one probationary period, or who fail clinical competencies, may be dismissed from the program.</p>
      
      <h4 class="font-semibold mb-2">Re-Admission</h4>
      <p>Students dismissed for academic reasons may apply for re-admission after a minimum of one cohort cycle. Re-admission is not guaranteed.</p>
    `,
  },
  {
    id: "ada",
    title: "ADA Accommodations",
    content: `
      <h4 class="font-semibold mb-2">Commitment to Accessibility</h4>
      <p class="mb-4">Aliko Academy is committed to providing equal educational opportunities to all students, including those with disabilities, in compliance with the Americans with Disabilities Act (ADA).</p>
      
      <h4 class="font-semibold mb-2">Requesting Accommodations</h4>
      <p class="mb-4">Students seeking accommodations should contact Student Services before or at the start of their program. Documentation of disability from a qualified professional may be required.</p>
      
      <h4 class="font-semibold mb-2">Available Accommodations</h4>
      <p class="mb-4">Accommodations are determined on an individual basis and may include extended test time, preferential seating, note-taking assistance, or alternative formats for materials.</p>
      
      <h4 class="font-semibold mb-2">Clinical Considerations</h4>
      <p>Students must be able to meet essential clinical functions with or without reasonable accommodations. The Program Director will work with students to determine feasible accommodations for clinical settings.</p>
    `,
  },
  {
    id: "privacy",
    title: "Privacy & FERPA",
    content: `
      <h4 class="font-semibold mb-2">Student Privacy Rights</h4>
      <p class="mb-4">Aliko Academy protects student privacy in accordance with the Family Educational Rights and Privacy Act (FERPA). Student records are confidential and access is restricted.</p>
      
      <h4 class="font-semibold mb-2">Student Rights Under FERPA</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Inspect and review education records</li>
        <li>Request amendment of inaccurate records</li>
        <li>Consent to disclosure of personally identifiable information</li>
        <li>File complaints with the U.S. Department of Education</li>
      </ul>
      
      <h4 class="font-semibold mb-2">Directory Information</h4>
      <p class="mb-4">Directory information (name, program, enrollment dates) may be disclosed without consent unless the student opts out in writing.</p>
      
      <h4 class="font-semibold mb-2">Data Security</h4>
      <p>Electronic student records are protected by secure systems. Staff access is limited to those with legitimate educational interest.</p>
    `,
  },
  {
    id: "conduct",
    title: "Code of Conduct",
    content: `
      <h4 class="font-semibold mb-2">Professional Standards</h4>
      <p class="mb-4">Students are expected to conduct themselves professionally at all times, both at Aliko Academy facilities and clinical sites. This includes appropriate dress, language, and behavior.</p>
      
      <h4 class="font-semibold mb-2">Academic Integrity</h4>
      <p class="mb-4">Cheating, plagiarism, and other forms of academic dishonesty are prohibited and may result in dismissal. Students must complete their own work unless group work is specifically assigned.</p>
      
      <h4 class="font-semibold mb-2">Prohibited Conduct</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Harassment or discrimination of any kind</li>
        <li>Violence or threats of violence</li>
        <li>Possession of weapons or controlled substances</li>
        <li>Falsification of records or documents</li>
        <li>Violation of patient confidentiality</li>
      </ul>
      
      <h4 class="font-semibold mb-2">Disciplinary Process</h4>
      <p>Violations may result in warnings, probation, suspension, or dismissal depending on severity. Students have the right to appeal disciplinary decisions.</p>
    `,
  },
];

const Policies = () => {
  return (
    <Layout>
      <section className="py-12 lg:py-16 bg-card">
        <div className="container-academy">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary">
            Policies & Student Handbook
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Review our institutional policies that govern academic programs,
            student conduct, and administrative procedures at Aliko Academy.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-academy">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {policies.map((policy) => (
                  <AccordionItem
                    key={policy.id}
                    value={policy.id}
                    id={policy.id}
                  >
                    <AccordionTrigger className="text-left">
                      {policy.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: policy.content }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-secondary/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> These policies are subject to change.
                Students are responsible for reviewing the most current version
                of the Student Handbook, which is provided at enrollment and
                available upon request. For questions about specific policies,
                please contact the Student Services office.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Policies;
