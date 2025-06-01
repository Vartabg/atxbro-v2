const fs = require('fs');
const path = require('path');

try {
 const statesDir = 'states';
 const stateDirs = fs.readdirSync(statesDir)
   .filter(dir => fs.statSync(path.join(statesDir, dir)).isDirectory());

 const vetnavBenefits = [];
 let benefitId = 1;

 stateDirs.forEach(state => {
   const filePath = path.join(statesDir, state, `${state}_benefits_summary.json`);
   
   if (fs.existsSync(filePath)) {
     const rawData = fs.readFileSync(filePath, 'utf8');
     const data = JSON.parse(rawData);
     
     Object.entries(data).forEach(([category, benefits]) => {
       benefits.forEach(benefit => {
         vetnavBenefits.push({
           id: `${state}_${benefitId++}`,
           state: state,
           title: benefit.split(' - ')[0],
           category: category,
           description: benefit,
           eligibility: extractEligibility(benefit),
           processingTime: "Varies by state",
           tags: generateTags(benefit, category, state)
         });
       });
     });
   }
 });

 function extractEligibility(benefit) {
   const eligibilityTerms = [];
   if (benefit.includes('100% disabled')) eligibilityTerms.push('100% disabled veteran');
   if (benefit.includes('children')) eligibilityTerms.push('veteran dependent');
   if (benefit.includes('spouse')) eligibilityTerms.push('veteran spouse');
   if (benefit.includes('combat')) eligibilityTerms.push('combat veteran');
   return eligibilityTerms.length ? eligibilityTerms : ['veteran'];
 }

 function generateTags(benefit, category, state) {
   return [
     category.toLowerCase(),
     state.toLowerCase(),
     ...benefit.toLowerCase().split(/[\s-]+/).filter(word => word.length > 3)
   ];
 }

 fs.writeFileSync('vetnavBenefitsDatabase.json', JSON.stringify(vetnavBenefits, null, 2));
 console.log(`Successfully converted ${vetnavBenefits.length} benefits for VetNav`);

} catch (error) {
 console.error('Error:', error.message);
}
