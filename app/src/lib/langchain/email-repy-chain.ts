import { PromptTemplate } from "langchain/prompts";
import { gptModel } from "../models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";

const CREATE_ANSWER = `Given the following input information, create an answer email for a student inquiry.

Original Question from Student: {email}

Top 3 Match Answers from Vector Database:
    Answer 1: {vdb_answer_1}
    Answer 2: {vdb_answer_2}
    Answer 3: {vdb_answer_3}

Tasks:
Review the student's original question and the filename of any attachments to understand the context and specific needs.
Evaluate the top 3 match answers from the vector database to determine which one best addresses the student's inquiry.
Select the most appropriate answer from the vector database. Consider aspects like relevance, completeness, and accuracy in relation to the student's question.
Refactor the chosen answer to enhance its informativeness. Ensure that the refactored answer:
    Directly addresses the student's question.
    Is clear, concise, and specific.
    Incorporates any relevant information from the email attachments, if applicable.
    Is structured in a friendly and professional tone suitable for email communication with a student.

Output:
Compose the answer email using the refactored and selected answer, ensuring it is tailored to the student's specific inquiry and presented in a manner that is easy to understand.

{further_info}
`;

const FORWARD_OR_NOT = `# Here's commonly used abbreviations at the TUM School of Management:
- SoM = School of Management
- MGT = Managament
- UPE = Undergraduate Program Education PM = Program Management / Program Manager
- PC = Program Coordinator
- GM = Grade Management
- IO = International Office
- BMT = Bachelor in Management and Technology = TUM BWL
- BSMT = Bachelor in Sustainable Management and Technology
- MMT = Master in Management and Technology = TUM BWL Master
- MiM = Master in Management
- MCS = Master in Consumer Science
- MMDT = Master in Management and Digital Technology
- FIM = Master in Finance and Information Management
- MSMT = Master in Sustainable Management and Technology
- MiMI = Master in Management and Innovation
- MMDT – Master in Management and Digital Technology
- JIP = Joint International Program
- EEP = Entrepreneurship Exchange Program
- STEP = Sustainable Transitions Exchange Program
- HEC = Grand École des Hautes Études Commerciales
- DTU = Denmarks Tekniske Universitet
- EMBA = Executive MBA
- BIT = Executive MBA in Business & IT
- IBC = Executive MBA in Innovation & Business Creation
- CST = Center for Study and Teaching
- APSO = Allgemeinen Prüfungs- und Studienordnung = General Academic and Examination Regulations
- FPSO = Fachspezifischen Prüfungs- und Studienordnung = Program-specific Academic and Examination Regulations
- WTW = wirtschaftswissenschaftlich-technischen Wahlbereich
- (A)IE = (Advanced) International Experience
- PS = Project Studies = Projektstudium
- GOP = Grundlagen- und Orientierungsprüfung
- SFK = Studienfortschrittskontrolle
- NPV = Noten- und Prüfungsverwaltung
- PA = Prüfungsausschuss
- PAU = Prüfungsausschuss
- SH = Student Hub
- MUC = Munich
- HN = Heilbronn
- VDASA = Vice Dean of Academic and Student Affairs
- E&P = Economics & Policy
- F&A = Finance & Accounting
- I&E = Innovation & Entrepreneurship
- MSL = Marketing, Strategy & Leadership
- OT = Operations & Technology

# Here's the different study programs that the TUM School of Management offers:
- Bachelor in Management & Technology (BMT) features courses in management studies as well as in natural sciences or engineering. We also call it TUM-BWL. It is available in Munich and Heilbronn campus.
- Master in Management & Technology (MMT): consecutive to BMT
- Master in Management & Digital Technology (MMDT) (Heilbronn): is the ideal blend of management, informatics, and technology.
- Master in Management (MiM): is aimed exclusively at engineers and natural scientists who want to receive a wide range of skills in management, law, economics and business. Also available at TUM Campus Heilbronn.
- Master in Consumer Science (MCS): is a truly interdisciplinary program that offers you a combination of management studies with social and consumer sciences. Students choosing this program usually have academic backgrounds in management, economics, sociology or psychology.
- Master in Finance & Information Management (FIM): In the Finance and Information Management (FIM) master's program, students learn how to push digital technologies in finance forward and how to deal with Big Data by integrating technologies.
- Bachelor in Sustainable Management & Technology (BSMT) (Straubing): aims to provide students with basic business knowledge for developing sustainable technologies, products, and processes. Coupled with interdisciplinary and social skills, the aim is to enable our students to support the change towards sustainable companies.
- Master in Sustainable Management & Technology (MSMT) (Straubing): By focusing on sustainability in entrepreneurial thinking and action, this specialization also shapes the profile of the TUMCS for Sustainability and Biotechnology and adds a new component to the portfolio of the Faculty of Business Administration and Economics


# Here's the task you need to perform:
Given the following input information, evaluate answers to student email inquiries, deciding whether the answer can be directly sent to the student or if it needs to be forwarded to specific student support personnel for further action.
    AnswerToEvaluate: {answer}

Your knowledge field/area of expertise:
Education administration, customer support, email communication analysis, decision-making protocols.

Approach this task step-by-step, take your time and do not skip steps:

Task to be done:
    Analyze the content and context you receive.
    Determine the nature and complexity of the inquiry and answer.
    Decide if the answer to the inquiry is suitable and can be sent back directly, or if it needs more information or if it requires forwarding to student support.
    It's very important that you only answer general questions directly and that the outcome for complex questions is that they will be forwarded to student support!  Especially forward questions that are related to grades, exams, and credits.
    If you have to tell the student that he needs or should reach out to further student support teams, please always output true for the forward decision!
    Output format: Always give me just a boolean value (true / false) for whether the email should be forwarded to student support (true), if you need more information (true) or can be sent directly back to the student (false).`;

const createAnswer = PromptTemplate.fromTemplate(CREATE_ANSWER);
const createForwardDecision = PromptTemplate.fromTemplate(FORWARD_OR_NOT);
/**
 * See a full list of supported models at:
 * https://js.langchain.com/docs/modules/model_io/models/
 */
const model = gptModel;
/**
 * Chat models stream message chunks rather than bytes, so this
 * output parser handles serialization and encoding.
 */
const outputParser = new BytesOutputParser();

/*
 * Can also initialize as:
 *
 * import { RunnableSequence } from "langchain/schema/runnable";
 * const chain = RunnableSequence.from([prompt, model, outputParser]);
 */
export const emailReplyChain = createAnswer.pipe(model).pipe(outputParser);
export const forwardChain = createForwardDecision
  .pipe(model)
  .pipe(outputParser);
