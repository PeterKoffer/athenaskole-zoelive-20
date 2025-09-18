export function faithMatrix(worldview:"neutral"|"christian", level:0|1|2|3, policy:any){
  if (policy?.publicDemoSafeMode) level = Math.min(level, 1) as 0|1|2|3;
  if (worldview !== "christian") level = 0;
  const entries = {
    0:{ label:"Off", rules:{ allowPrayer:false, allowScripture:false, tone:"neutral" } },
    1:{ label:"Light", rules:{ allowPrayer:false, allowScripture:false, tone:"values", creationCare:true, serviceLearning:true } },
    2:{ label:"Moderate", rules:{ allowPrayer:true, allowScripture:true, scriptureMaxWords:20, tone:"respectful" } },
    3:{ label:"Strong", rules:{ allowPrayer:true, allowScripture:true, scriptureMaxWords:40, tone:"overt" } }
  };
  return entries[level];
}