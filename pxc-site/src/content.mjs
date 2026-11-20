// Shared copy. Facts here come from the build guide; nothing is invented.
export const DOMINOES = [
  { t: 'Phones and Callbacks', d: 'A missed call with no owner is still open at the end of the day, and the patient calls again.', q: 'Calls go to voicemail or sit on hold while the desk is busy.', signs: 'Voicemail full by mid-morning. The same patient calling twice. Callbacks written on paper.', fix: 'One named owner for callbacks, and a set time each day when the list is cleared.' },
  { t: 'Arrival and Check-In', d: 'Forms, insurance questions and a line at the window all start at the same minute.', q: 'A line forms at the window when patients arrive.', signs: 'Clipboards at the window. Insurance questions answered in front of the line. Late starts for the first visit.', fix: 'Move what can be done before arrival to before arrival, and give the window one job.' },
  { t: 'Wait Time and Flow', d: 'A delay nobody names feels longer, and the desk absorbs the frustration.', q: 'Patients wait without being told how long or why.', signs: 'Patients asking the desk how much longer. No one owning the update. Tension by late morning.', fix: 'A simple rule for when a delay is named, who says it, and what they say.' },
  { t: 'Scheduling Integrity', d: 'Overrides with no rule fill the day past what the team can actually run.', q: 'The schedule gets overridden or double-booked.', signs: 'Double-booked slots. Days that run over. "Just squeeze them in."', fix: 'A written override rule: who may, when, and how many a day.' },
  { t: 'No-Shows and Confirmations', d: 'A reminder goes out, nobody owns the reply, and an open slot sits empty.', q: 'Reminder replies go unanswered and open slots stay empty.', signs: 'Reminders sent, replies unread. Empty slots found the same day. No waitlist in use.', fix: 'One owner for replies, and a short list for filling a slot that opens.' },
  { t: 'Checkout and Follow-Through', d: 'The visit ends at the door, and the next step is nobody\'s task.', q: 'Patients leave without the next step booked or assigned.', signs: 'Follow-ups not scheduled at checkout. Referrals waiting. Patients calling to ask what happens next.', fix: 'A checkout script that ends with a booked next step or a named owner.' },
  { t: 'Admin Requests and Messages', d: 'Refills, forms, records and portal notes share one pile and no turnaround.', q: 'Refills, forms and portal messages pile up with no set turnaround.', signs: 'One inbox for everything. No promised turnaround. Patients calling to check on a form.', fix: 'Sort by type, give each type a turnaround, and post the turnaround where the team can see it.' },
  { t: 'Handoffs and Escalation', d: 'Front-to-clinical handoffs depend on who happens to be nearby.', q: 'Handoffs to the clinical team depend on who is nearby.', signs: '"I sent it" with no confirmation. Messages passed in the hallway. Urgent items found late.', fix: 'A handoff is done when it is received, not when it is sent. Write down what counts as received.' },
  { t: 'Team Stability and Onboarding', d: 'A new hire inherits whatever was never written down, and the pattern repeats.', q: 'New front desk hires learn by watching, not from anything written.', signs: 'Training by shadowing only. The manager covering the desk. The same questions from every new hire.', fix: 'Write the three routines a new hire needs in week one, and teach from the page.' },
  { t: 'Reputation and Feedback', d: 'Reviews are often the last domino. Nine others fell first.', q: 'Reviews or complaints mention the phones, the wait or the front desk.', signs: 'Reviews that mention the phone or the wait, not the care. Complaints heard third-hand.', fix: 'Read reviews as a map. Each one usually points at an earlier domino.' },
];

export const FAQ_HOME = [
  ['What does PXC actually do?', 'We fix front-desk operations at independent medical practices. We find the three problems causing the most trouble, fix them with your team over 90 days, and measure the result.'],
  ['Is the free screener an audit?', 'No. The screener is ten questions and a first read. The Practice Audit is a five-day count and observation.'],
  ['How much does the 90-Day Reset cost?', '$12,500 for one location, half at signing and half at kickoff. The $1,500 audit is credited if you sign within 30 days.'],
  ['Do we have to buy AI?', 'No. AI is set up only where your audit shows it will help your team.'],
  ['Will you need patient records?', 'No. We never ask for patient information.'],
  ['What happens after day 90?', 'Your team keeps the huddle, the scoreboard and the monthly review. If the day-90 number was missed and you met your side, we keep working through day 180.'],
  ['Who is this for?', 'Independent practices with 2 to 20 providers and one or two locations.'],
  ['Do you come on-site?', 'All work is virtual, nationwide, from Bradenton, Florida.'],
];

// Drafted from the facts in the build guide. Review against the live Reset page before launch.
export const FAQ_RESET = [
  ['How much staff time does the Reset take?', 'Plan on a few hours a week from the owner and the manager. The front desk team tallies the five-day count alongside the normal day, then practices each new routine in short sessions. The work is built to fit inside the day your team already has, not on top of it.'],
  ['What if a front desk person leaves mid-Reset?', 'The Reset is built for that. Every fix has a written rule, a named owner and a script, so the routine belongs to the practice and not to one person. A new hire is trained from the same pages, and the weekly number keeps counting.'],
  ['Do you replace staff with AI?', 'No. AI is set up only where your audit shows it will help your team, such as after-hours call capture, reminders and confirmations, or message sorting. Your team is trained on it and we count whether it worked. If AI is not the answer, we will say so.'],
  ['What is outside the Reset?', 'EHR builds, billing projects and hiring searches are outside the Reset. So is clinical care. The Reset covers three front-desk priorities chosen by your audit and signed by you, and it stays on those three so they are finished and measured.'],
  ['What if we have more than two locations?', 'The Reset is built for practices with one or two locations. The price covers one location, and each additional location is $3,000. Health systems are not a fit. If you have three or more sites, call (941) 239-2309 and we will tell you plainly whether it makes sense.'],
  ['Can we start without the audit?', 'Yes. Every Reset begins with the same five-day count, so the Practice Audit is not a requirement. If you have already done the audit, your $1,500 is credited when you sign within 30 days of your findings call.'],
];

export const FAQ_AUDIT = [
  ['What is the Practice Audit?', 'A five-business-day count of your front desk, an observation of your hardest hour, and a findings call that ends with a Top 3 you sign. It costs $1,500 and uses no patient information.'],
  ['What do we get at the end?', 'The five-day count, the observation notes, your Domino Map, a signed Top 3 and a quick-win kit your team can use right away.'],
  ['Is the $1,500 credited to the Reset?', 'Yes. The $1,500 is credited to the 90-Day Reset if you sign within 30 days of your findings call.'],
  ['Do you need access to our EHR or patient records?', 'No. Your team tallies calls, lines, overrides, no-shows and open messages. No names, no charts, no patient information.'],
];

export const SHEET_ROWS = ['Calls missed per day', 'Longest line at check-in', 'Schedule overrides per day', 'No-shows per week', 'Messages open at close'];
