export interface ParticipationTemplateItem {
  name: string;
  description: string;
  badge: string;
  accentColor: string;
}

export const PARTICIPATION_CERTIFICATE_TEMPLATES: ParticipationTemplateItem[] = [
  {
    name: 'Participation Certificate 1',
    description: 'Vibrant indigo and violet modern gradient design with ribbon medallion.',
    badge: 'Creative & Modern',
    accentColor: '#4f46e5',
  },
  {
    name: 'Participation Certificate 2',
    description: 'Corporate executive emerald and gold double border with ornate corners.',
    badge: 'Professional & Business',
    accentColor: '#059669',
  },
  {
    name: 'Participation Certificate 3',
    description: 'Sleek tech aesthetic with sharp geometric lines and credential seal.',
    badge: 'Clean & Tech',
    accentColor: '#0284c7',
  },
  {
    name: 'Participation Certificate 4',
    description: 'Traditional ivory parchment aesthetic with royal navy and gold crest.',
    badge: 'Academic & Formal',
    accentColor: '#1e3a8a',
  },
];

export function getParticipationTemplateHtml(
  templateName: string,
  sampleData: {
    studentName?: string;
    courseTitle?: string;
    issueDate?: string;
    certId?: string;
    instructorName?: string;
  } = {}
): string {
  const student = sampleData.studentName || 'Alex Morgan';
  const course = sampleData.courseTitle || 'Complete Full-Stack Web & Cloud Architecture';
  const date = sampleData.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const certId = sampleData.certId || 'STX-PART-2026-8894';
  const instructor = sampleData.instructorName || 'Academic Director & Instructor';

  const normalized = (templateName || '').toLowerCase();

  // Template 2: Emerald & Gold
  if (normalized.includes('2') || normalized.includes('emerald') || normalized.includes('professional')) {
    return `
<div style="width: 820px; max-width: 100%; margin: 0 auto; padding: 24px; background: #ffffff; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="border: 8px solid #064e3b; outline: 2px solid #d97706; outline-offset: -14px; padding: 36px; background: #fdfdfd; position: relative; text-align: center;">
    
    <!-- Header / Branding -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 14px; margin-bottom: 24px;">
      <div style="text-align: left;">
        <span style="font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #064e3b;">StrideNEX</span>
        <span style="font-size: 11px; font-weight: 700; color: #d97706; margin-left: 6px; letter-spacing: 1px;">EXECUTIVE LEARNING</span>
      </div>
      <div style="font-size: 11px; color: #6b7280; font-weight: 600;">ID: <span style="font-family: monospace; color: #111827;">${certId}</span></div>
    </div>

    <!-- Title -->
    <div style="margin: 20px 0 10px 0;">
      <span style="display: inline-block; font-size: 10px; font-weight: 800; letter-spacing: 3px; color: #047857; text-transform: uppercase; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 12px; rounded-full; border-radius: 9999px;">OFFICIAL RECOGNITION</span>
      <h1 style="font-size: 30px; font-weight: 900; letter-spacing: 3px; color: #064e3b; margin: 12px 0 6px 0; text-transform: uppercase;">Certificate of Participation</h1>
      <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">This document certifies that</p>
    </div>

    <!-- Recipient -->
    <div style="margin: 20px 0;">
      <div style="font-size: 34px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #059669; display: inline-block; padding: 0 36px 6px 36px; font-family: 'Georgia', serif;">
        ${student}
      </div>
    </div>

    <!-- Body -->
    <p style="font-size: 13px; color: #4b5563; line-height: 1.6; max-width: 580px; margin: 0 auto 20px auto;">
      has actively participated in, contributed to, and successfully concluded all mandatory practical workshops, exercises, and theoretical training for
    </p>

    <!-- Course Title -->
    <div style="font-size: 20px; font-weight: 800; color: #047857; margin-bottom: 30px;">
      ${course}
    </div>

    <!-- Footer Signatures & Seal -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <div style="text-align: center; width: 180px;">
        <div style="font-size: 14px; font-weight: 700; color: #111827;">${date}</div>
        <div style="height: 1.5px; background: #9ca3af; margin: 6px auto; width: 140px;"></div>
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Date of Issue</div>
      </div>

      <!-- Golden Seal -->
      <div style="text-align: center;">
        <div style="width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #047857); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 24px; margin: 0 auto 6px auto; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35); border: 3px solid #d97706;">
          ✓
        </div>
        <div style="font-size: 10px; font-weight: 800; color: #047857; letter-spacing: 1px; text-transform: uppercase;">Verified Participant</div>
      </div>

      <div style="text-align: center; width: 180px;">
        <div style="font-family: 'Brush Script MT', cursive, serif; font-size: 24px; color: #064e3b;">${instructor}</div>
        <div style="height: 1.5px; background: #9ca3af; margin: 6px auto; width: 140px;"></div>
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Authorized Signature</div>
      </div>
    </div>
  </div>
</div>`;
  }

  // Template 3: Modern Minimalist
  if (normalized.includes('3') || normalized.includes('minimalist')) {
        return `
<div style="width: 820px; max-width: 100%; margin: 0 auto; padding: 24px; background: #ffffff; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="border: 2px solid #0f172a; padding: 40px; background: #ffffff; position: relative; text-align: left;">
    
    <!-- Top Geometric Accent Bar -->
    <div style="height: 6px; background: linear-gradient(90deg, #0284c7, #38bdf8, #0f172a); margin-bottom: 28px;"></div>

    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
      <div>
        <div style="font-size: 22px; font-weight: 900; letter-spacing: 1.5px; color: #0f172a;">STRIDENEX</div>
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 2px; color: #0284c7; text-transform: uppercase; margin-top: 2px;">CONTINUOUS LEARNING INITIATIVE</div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 10px; font-weight: 700; background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-family: monospace;">VERIFIED CREDENTIAL</span>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">ID: ${certId}</div>
      </div>
    </div>

    <div style="margin: 24px 0 10px 0;">
      <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; margin: 0 0 6px 0; text-transform: uppercase;">
        Certificate of Participation
      </h1>
      <p style="font-size: 13px; color: #64748b; margin: 0;">This document validates that the learner specified below has participated in:</p>
    </div>

    <!-- Course Block -->
    <div style="margin: 18px 0; padding: 14px 18px; background: #f8fafc; border-left: 4px solid #0284c7; border-radius: 4px;">
      <div style="font-size: 20px; font-weight: 800; color: #0f172a;">${course}</div>
    </div>

    <!-- Recipient -->
    <div style="margin: 24px 0 16px 0;">
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">Awarded To</div>
      <div style="font-size: 32px; font-weight: 800; color: #0284c7; margin-top: 4px;">${student}</div>
    </div>

    <p style="font-size: 12px; color: #64748b; line-height: 1.6; max-width: 600px; margin: 0 0 32px 0;">
      Demonstrating commitment to skill acquisition, engaged participation in peer discussions, and completion of all core syllabus requirements.
    </p>

    <!-- Signatures -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 24px; border-top: 1px solid #e2e8f0;">
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${date}</div>
        <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-top: 2px;">Issued On</div>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; border: 1px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #0284c7;">
          ❖
        </div>
        <div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a;">StrideNEX Certified</div>
          <div style="font-size: 10px; color: #64748b;">Digitally Authenticated</div>
        </div>
      </div>

      <div style="text-align: right;">
        <div style="font-family: 'Brush Script MT', cursive, serif; font-size: 22px; color: #0f172a;">${instructor}</div>
        <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-top: 2px;">Program Director</div>
      </div>
    </div>
  </div>
</div>`;
  }

  // Template 4: Academic Honors
  if (normalized.includes('4') || normalized.includes('honors') || normalized.includes('academic')) {
    return `
<div style="width: 820px; max-width: 100%; margin: 0 auto; padding: 24px; background: #fffdfa; box-sizing: border-box; font-family: 'Georgia', serif; color: #1e293b;">
  <div style="border: 4px double #1e3a8a; padding: 36px; background: #fffefc; position: relative; text-align: center; box-shadow: 0 4px 20px rgba(30, 58, 138, 0.06);">
    
    <!-- Academic Crest Icon -->
    <div style="width: 54px; height: 54px; margin: 0 auto 12px auto; border-radius: 50%; background: #1e3a8a; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 26px; box-shadow: 0 4px 10px rgba(30,58,138,0.25);">
      🏛
    </div>

    <div style="font-size: 14px; font-weight: 700; letter-spacing: 3px; color: #1e3a8a; text-transform: uppercase; margin-bottom: 4px;">
      StrideNEX Academic Registry
    </div>
    <div style="font-size: 10px; letter-spacing: 1.5px; color: #b45309; text-transform: uppercase; margin-bottom: 16px;">
      Institute for Professional & Technical Education
    </div>

    <h1 style="font-size: 28px; font-weight: 800; letter-spacing: 3px; color: #1e3a8a; text-transform: uppercase; margin: 10px 0 6px 0;">
      Certificate of Attendance & Participation
    </h1>
    <p style="font-size: 13px; font-style: italic; color: #64748b; margin: 0 0 16px 0;">
      By the authority vested in the faculty and academic committee, this is conferred upon
    </p>

    <!-- Recipient -->
    <div style="margin: 14px 0;">
      <div style="font-size: 34px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #b45309; display: inline-block; padding: 0 32px 6px 32px; font-style: italic;">
        ${student}
      </div>
    </div>

    <!-- Body -->
    <p style="font-size: 13px; color: #334155; line-height: 1.7; max-width: 560px; margin: 12px auto 20px auto;">
      in formal recognition of fulfilling all learning objectives, instructional hours, and participating faithfully in the comprehensive curriculum of
    </p>

    <!-- Course Title -->
    <div style="font-size: 19px; font-weight: 800; color: #1e3a8a; margin-bottom: 28px;">
      ${course}
    </div>

    <!-- Signatures & Golden Ribbon -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <div style="text-align: center; width: 170px;">
        <div style="font-size: 13px; font-weight: 700; color: #1e293b;">${date}</div>
        <div style="height: 1px; background: #64748b; margin: 6px auto; width: 130px;"></div>
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Date Conferred</div>
      </div>

      <div style="text-align: center;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle, #fde68a, #d97706); display: flex; align-items: center; justify-content: center; color: #78350f; font-weight: 900; font-size: 24px; margin: 0 auto 4px auto; border: 2px dashed #92400e;">
          ✦
        </div>
        <div style="font-size: 9px; font-weight: 800; color: #92400e; letter-spacing: 1px; text-transform: uppercase;">Honor Seal</div>
      </div>

      <div style="text-align: center; width: 170px;">
        <div style="font-family: 'Brush Script MT', cursive, serif; font-size: 22px; color: #1e3a8a;">${instructor}</div>
        <div style="height: 1px; background: #64748b; margin: 6px auto; width: 130px;"></div>
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Authorized Signatory</div>
      </div>
    </div>
  </div>
</div>`;
  }

  // Default / Template 1: Creative Pathways
  return `
<div style="width: 820px; max-width: 100%; margin: 0 auto; padding: 24px; background: #ffffff; box-sizing: border-box; font-family: 'Georgia', serif; text-align: center; color: #1e1b4b;">
  <div style="border: 10px solid #4f46e5; border-image: linear-gradient(135deg, #4f46e5, #7c3aed, #a855f7) 1; padding: 36px; background: radial-gradient(circle at center, #ffffff 60%, #faf5ff 100%); position: relative; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.08);">
    
    <!-- Inner gold border -->
    <div style="border: 2px solid #f59e0b; padding: 24px; position: relative;">
      
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px;">
        <span style="font-size: 22px; font-weight: 900; letter-spacing: 2px; color: #4338ca; font-family: -apple-system, sans-serif;">StrideNEX</span>
        <span style="font-size: 11px; font-weight: 700; background: #ede9fe; color: #5b21b6; padding: 3px 10px; border-radius: 9999px; letter-spacing: 1px; font-family: sans-serif;">CREATIVE PATHWAYS</span>
      </div>

      <h1 style="font-size: 30px; font-weight: 800; letter-spacing: 3px; margin: 14px 0 6px 0; color: #312e81; text-transform: uppercase;">
        Certificate of Participation
      </h1>
      <p style="font-size: 13px; font-style: italic; color: #6b7280; margin: 0 0 18px 0;">This certificate is proudly awarded to</p>

      <!-- Recipient Name -->
      <div style="font-size: 34px; font-weight: 700; color: #1e1b4b; margin: 10px 0 14px 0; border-bottom: 2px solid #c7d2fe; display: inline-block; padding: 0 32px 6px 32px; font-style: italic;">
        ${student}
      </div>

      <p style="font-size: 13px; color: #4b5563; line-height: 1.6; max-width: 540px; margin: 0 auto 18px auto; font-family: -apple-system, sans-serif;">
        for active engagement, dedication, and successful completion of the learning milestones and curriculum of
      </p>

      <!-- Course Title -->
      <div style="font-size: 19px; font-weight: 800; color: #4338ca; margin-bottom: 24px; font-family: -apple-system, sans-serif;">
        ${course}
      </div>

      <!-- Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; padding-top: 18px; border-top: 1px dashed #c7d2fe; font-family: -apple-system, sans-serif;">
        <div style="text-align: center; width: 170px;">
          <div style="font-size: 13px; font-weight: 700; color: #374151;">${date}</div>
          <div style="height: 1px; background: #9ca3af; margin: 6px auto; width: 120px;"></div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Date Issued</div>
        </div>

        <div style="text-align: center;">
          <div style="width: 62px; height: 62px; margin: 0 auto 4px auto; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 22px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);">
            ★
          </div>
          <div style="font-size: 10px; font-weight: 800; color: #b45309; letter-spacing: 1px; text-transform: uppercase;">Official Verified</div>
        </div>

        <div style="text-align: center; width: 170px;">
          <div style="font-family: 'Brush Script MT', cursive, serif; font-size: 22px; color: #312e81;">${instructor}</div>
          <div style="height: 1px; background: #9ca3af; margin: 6px auto; width: 120px;"></div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Authorized Signature</div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

