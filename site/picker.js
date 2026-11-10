// Geometry and typography retained from the supplied 365 Day & Night art direction.
// The artwork is embedded here so builds never depend on the ignored reference files.
const ARTWORK = `<g pointer-events="none" fill="none" stroke="{{c.muted}}" stroke-linecap="round">
<path d="M262.53 3.08L262.66 -1.91M266.88 3.23L267.1 -1.76M271.23 3.46L271.54 -1.53M275.58 3.76L275.97 -1.23M279.92 4.13L280.39 -0.84M284.25 4.58L284.81 -0.39M288.57 5.11L289.22 0.15M292.89 5.7L293.62 0.76M297.19 6.38L298 1.44M301.48 7.12L302.38 2.2M305.76 7.94L306.74 3.04M310.02 8.83L311.09 3.95M314.27 9.8L315.42 4.94M318.5 10.84L319.73 6M322.71 11.95L324.03 7.13M326.9 13.14L328.3 8.34M331.07 14.39L332.55 9.62M335.22 15.72L336.78 10.97M339.34 17.12L340.99 12.4M343.44 18.59L345.17 13.9M347.51 20.13L349.32 15.47M351.56 21.74L353.45 17.11M355.58 23.42L357.55 18.82M359.57 25.17L361.61 20.61M363.53 26.99L365.65 22.46M367.45 28.87L369.65 24.38M371.34 30.82L373.62 26.37M375.2 32.84L377.56 28.43M379.03 34.93L381.46 30.56M382.81 37.08L385.32 32.75M390.27 41.57L392.93 37.33M393.95 43.92L396.67 39.72M397.58 46.32L400.37 42.18M401.16 48.79L404.03 44.69M404.71 51.32L407.65 47.27M408.21 53.91L411.22 49.91M411.67 56.56L414.74 52.62M415.08 59.27L418.22 55.38M418.44 62.04L421.65 58.2M421.75 64.86L425.03 61.08M425.02 67.74L428.36 64.02M428.24 70.68L431.64 67.02M431.4 73.67L434.87 70.07M434.51 76.72L438.04 73.17M437.57 79.82L441.16 76.33M440.58 82.97L444.23 79.55M443.53 86.17L447.24 82.81M446.42 89.42L450.19 86.13M449.26 92.73L453.08 89.5M452.05 96.08L455.92 92.92M454.77 99.48L458.7 96.38M457.43 102.92L461.42 99.9M460.04 106.41L464.07 103.45M462.58 109.95L466.67 107.06M465.07 113.52L469.2 110.71M467.49 117.14L471.67 114.4M469.85 120.8L474.07 118.13M474.37 128.24L478.69 125.72M476.54 132.02L480.9 129.57M478.64 135.84L483.04 133.46M480.68 139.69L485.12 137.39M482.65 143.57L487.13 141.35M484.55 147.49L489.07 145.35M486.38 151.44L490.94 149.37M488.15 155.42L492.74 153.43M489.85 159.43L494.47 157.52M491.47 163.47L496.13 161.64M493.03 167.54L497.72 165.79M494.52 171.63L499.23 169.97M495.94 175.75L500.68 174.16M497.28 179.89L502.05 178.39M498.56 184.06L503.35 182.64M499.76 188.24L504.58 186.9M500.89 192.45L505.73 191.19M501.95 196.67L506.81 195.5M502.93 200.92L507.81 199.83M503.84 205.17L508.74 204.17M504.68 209.45L509.6 208.53M505.44 213.74L510.37 212.9M506.14 218.04L511.08 217.29M506.75 222.35L511.71 221.68M507.29 226.67L512.26 226.09M507.76 231L512.74 230.5M508.15 235.34L513.14 234.93M508.47 239.68L513.46 239.36M508.72 244.03L513.71 243.79M508.89 248.38L513.88 248.23M509 257.09L514 257.11M508.94 261.44L513.94 261.55M508.81 265.8L513.81 265.99M508.6 270.15L513.6 270.43M508.32 274.49L513.31 274.86M507.97 278.83L512.95 279.28M507.54 283.17L512.51 283.7M507.03 287.49L511.99 288.12M506.45 291.81L511.4 292.52M505.8 296.12L510.74 296.91M505.07 300.41L509.99 301.29M504.27 304.69L509.18 305.65M503.4 308.96L508.28 310M502.45 313.21L507.32 314.34M501.43 317.44L506.28 318.66M500.33 321.66L505.16 322.95M499.17 325.85L503.97 327.23M497.93 330.03L502.71 331.49M496.62 334.18L501.37 335.73M495.24 338.31L499.96 339.94M493.78 342.42L498.48 344.13M492.26 346.5L496.93 348.29M490.67 350.55L495.31 352.42M489.01 354.58L493.61 356.52M487.27 358.57L491.85 360.6M485.47 362.54L490.01 364.64M483.61 366.47L488.1 368.66M481.67 370.37L486.13 372.63M479.67 374.24L484.09 376.58M475.47 381.87L479.8 384.36M473.27 385.63L477.56 388.19M471 389.35L475.25 391.99M468.68 393.03L472.88 395.74M466.29 396.67L470.44 399.45M463.83 400.27L467.94 403.12M461.32 403.83L465.38 406.75M458.74 407.34L462.75 410.33M456.11 410.81L460.06 413.87M453.41 414.23L457.32 417.36M450.66 417.6L454.51 420.8M447.85 420.93L451.64 424.19M444.98 424.21L448.72 427.53M442.06 427.44L445.74 430.82M439.08 430.61L442.7 434.06M436.05 433.74L439.61 437.25M432.96 436.81L436.46 440.39M429.82 439.83L433.26 443.46M426.63 442.8L430.01 446.49M423.39 445.71L426.7 449.46M420.1 448.56L423.35 452.36M416.76 451.36L419.94 455.22M413.38 454.09L416.49 458.01M409.94 456.77L412.99 460.74M406.47 459.39L409.44 463.41M402.94 461.95L405.85 466.02M399.38 464.45L402.21 468.57M395.77 466.89L398.53 471.06M392.12 469.26L394.81 473.48M388.42 471.58L391.04 475.84M380.93 476.01L383.39 480.35M377.12 478.12L379.51 482.51M373.28 480.18L375.6 484.61M369.4 482.16L371.64 486.63M365.49 484.08L367.66 488.59M361.55 485.93L363.64 490.47M357.58 487.71L359.58 492.29M353.57 489.43L355.5 494.04M349.54 491.07L351.39 495.72M345.48 492.65L347.25 497.32M341.39 494.15L343.08 498.86M337.28 495.59L338.89 500.32M333.15 496.95L334.67 501.71M328.99 498.24L330.43 503.03M324.81 499.46L326.17 504.28M320.6 500.61L321.88 505.45M316.38 501.69L317.58 506.54M312.15 502.69L313.26 507.57M307.89 503.62L308.92 508.51M303.62 504.48L304.56 509.39M299.34 505.26L300.19 510.19M295.04 505.97L295.81 510.91M290.73 506.6L291.42 511.56M286.41 507.17L287.01 512.13M282.08 507.65L282.6 512.63M277.75 508.06L278.18 513.04M273.41 508.4L273.75 513.39M269.06 508.66L269.32 513.66M264.71 508.85L264.88 513.85M256 509L256 514M251.65 508.96L251.56 513.96M247.29 508.85L247.12 513.85M242.94 508.66L242.68 513.66M238.59 508.4L238.25 513.39M234.25 508.06L233.82 513.04M229.92 507.65L229.4 512.63M225.59 507.17L224.99 512.13M221.27 506.6L220.58 511.56M216.96 505.97L216.19 510.91M212.66 505.26L211.81 510.19M208.38 504.48L207.44 509.39M204.11 503.62L203.08 508.51M199.85 502.69L198.74 507.57M195.62 501.69L194.42 506.54M191.4 500.61L190.12 505.45M187.19 499.46L185.83 504.28M183.01 498.24L181.57 503.03M178.85 496.95L177.33 501.71M174.72 495.59L173.11 500.32M170.61 494.15L168.92 498.86M166.52 492.65L164.75 497.32M162.46 491.07L160.61 495.72M158.43 489.43L156.5 494.04M154.42 487.71L152.42 492.29M150.45 485.93L148.36 490.47M146.51 484.08L144.34 488.59M142.6 482.16L140.36 486.63M138.72 480.18L136.4 484.61M134.88 478.12L132.49 482.51M127.31 473.82L124.76 478.13M123.58 471.58L120.96 475.84M119.88 469.26L117.19 473.48M116.23 466.89L113.47 471.06M112.62 464.45L109.79 468.57M109.06 461.95L106.15 466.02M105.53 459.39L102.56 463.41M102.06 456.77L99.01 460.74M98.62 454.09L95.51 458.01M95.24 451.36L92.06 455.22M91.9 448.56L88.65 452.36M88.61 445.71L85.3 449.46M85.37 442.8L81.99 446.49M82.18 439.83L78.74 443.46M79.04 436.81L75.54 440.39M75.95 433.74L72.39 437.25M72.92 430.61L69.3 434.06M69.94 427.44L66.26 430.82M67.02 424.21L63.28 427.53M64.15 420.93L60.36 424.19M61.34 417.6L57.49 420.8M58.59 414.23L54.68 417.36M55.89 410.81L51.94 413.87M53.26 407.34L49.25 410.33M50.68 403.83L46.62 406.75M48.17 400.27L44.06 403.12M45.71 396.67L41.56 399.45M43.32 393.03L39.12 395.74M41 389.35L36.75 391.99M38.73 385.63L34.44 388.19M34.4 378.07L30.02 380.49M32.33 374.24L27.91 376.58M30.33 370.37L25.87 372.63M28.39 366.47L23.9 368.66M26.53 362.54L21.99 364.64M24.73 358.57L20.15 360.6M22.99 354.58L18.39 356.52M21.33 350.55L16.69 352.42M19.74 346.5L15.07 348.29M18.22 342.42L13.52 344.13M16.76 338.31L12.04 339.94M15.38 334.18L10.63 335.73M14.07 330.03L9.29 331.49M12.83 325.85L8.03 327.23M11.67 321.66L6.84 322.95M10.57 317.44L5.72 318.66M9.55 313.21L4.68 314.34M8.6 308.96L3.72 310M7.73 304.69L2.82 305.65M6.93 300.41L2.01 301.29M6.2 296.12L1.26 296.91M5.55 291.81L0.6 292.52M4.97 287.49L0.01 288.12M4.46 283.17L-0.51 283.7M4.03 278.83L-0.95 279.28M3.68 274.49L-1.31 274.86M3.4 270.15L-1.6 270.43M3.19 265.8L-1.81 265.99M3.06 261.44L-1.94 261.55M3.02 252.73L-1.98 252.67M3.11 248.38L-1.88 248.23M3.28 244.03L-1.71 243.79M3.53 239.68L-1.46 239.36M3.85 235.34L-1.14 234.93M4.24 231L-0.74 230.5M4.71 226.67L-0.26 226.09M5.25 222.35L0.29 221.68M5.86 218.04L0.92 217.29M6.56 213.74L1.63 212.9M7.32 209.45L2.4 208.53M8.16 205.17L3.26 204.17M9.07 200.92L4.19 199.83M10.05 196.67L5.19 195.5M11.11 192.45L6.27 191.19M12.24 188.24L7.42 186.9M13.44 184.06L8.65 182.64M14.72 179.89L9.95 178.39M16.06 175.75L11.32 174.16M17.48 171.63L12.77 169.97M18.97 167.54L14.28 165.79M20.53 163.47L15.87 161.64M22.15 159.43L17.53 157.52M23.85 155.42L19.26 153.43M25.62 151.44L21.06 149.37M27.45 147.49L22.93 145.35M29.35 143.57L24.87 141.35M31.32 139.69L26.88 137.39M33.36 135.84L28.96 133.46M35.46 132.02L31.1 129.57M39.86 124.5L35.58 121.91M42.15 120.8L37.93 118.13M44.51 117.14L40.33 114.4M46.93 113.52L42.8 110.71M49.42 109.95L45.33 107.06M51.96 106.41L47.93 103.45M54.57 102.92L50.58 99.9M57.23 99.48L53.3 96.38M59.95 96.08L56.08 92.92M62.74 92.73L58.92 89.5M65.58 89.42L61.81 86.13M68.47 86.17L64.76 82.81M71.42 82.97L67.77 79.55M74.43 79.82L70.84 76.33M77.49 76.72L73.96 73.17M80.6 73.67L77.13 70.07M83.76 70.68L80.36 67.02M86.98 67.74L83.64 64.02M90.25 64.86L86.97 61.08M93.56 62.04L90.35 58.2M96.92 59.27L93.78 55.38M100.33 56.56L97.26 52.62M103.79 53.91L100.78 49.91M107.29 51.32L104.35 47.27M110.84 48.79L107.97 44.69M114.42 46.32L111.63 42.18M118.05 43.92L115.33 39.72M121.73 41.57L119.07 37.33M125.44 39.29L122.86 35.01M132.97 34.93L130.54 30.56M136.8 32.84L134.44 28.43M140.66 30.82L138.38 26.37M144.55 28.87L142.35 24.38M148.47 26.99L146.35 22.46M152.43 25.17L150.39 20.61M156.42 23.42L154.45 18.82M160.44 21.74L158.55 17.11M164.49 20.13L162.68 15.47M168.56 18.59L166.83 13.9M172.66 17.12L171.01 12.4M176.78 15.72L175.22 10.97M180.93 14.39L179.45 9.62M185.1 13.14L183.7 8.34M189.29 11.95L187.97 7.13M193.5 10.84L192.27 6M197.73 9.8L196.58 4.94M201.98 8.83L200.91 3.95M206.24 7.94L205.26 3.04M210.52 7.12L209.62 2.2M214.81 6.38L214 1.44M219.11 5.7L218.38 0.76M223.43 5.11L222.78 0.15M227.75 4.58L227.19 -0.39M232.08 4.13L231.61 -0.84M236.42 3.76L236.03 -1.23M240.77 3.46L240.46 -1.53M245.12 3.23L244.9 -1.76M249.47 3.08L249.34 -1.91M253.82 3.01L253.78 -1.99" stroke-width=".9" stroke-opacity=".5">
</path>
<path d="M256 4L256 -8M384.19 39.04L390.29 28.71M470.15 123.18L480.35 116.85M507.94 250.58L519.94 250.32M477.76 375.69L488.32 381.39M386.05 471.85L392.24 482.13M262.51 507.92L262.82 519.91M133.46 476.2L127.62 486.69M38.49 383.25L28.13 389.31M4.02 259.25L-7.98 259.41M37.4 130.63L26.99 124.66M127.81 39.04L121.71 28.71" stroke-width="1.8" stroke-opacity=".9">
</path>
</g>
<path d="M295 45.58A214 214 0 0 1 329.46 55L313.89 81.34A184 184 0 0 0 295 76.18Z" fill="{{g0.fill}}" stroke="{{g0.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M396.61 94.68A214 214 0 0 1 414.26 111.95L388.26 128.08A184 184 0 0 0 381.05 121.02Z" fill="{{g1.fill}}" stroke="{{g1.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M455.37 178.24A214 214 0 0 1 465.53 212.48L434.94 213.14A184 184 0 0 0 429.37 194.36Z" fill="{{g2.fill}}" stroke="{{g2.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M467.21 290.46A214 214 0 0 1 459.69 321.62L432.77 307.08A184 184 0 0 0 436.62 291.12Z" fill="{{g3.fill}}" stroke="{{g3.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M422.65 390.26A214 214 0 0 1 397.99 416.11L382.2 389.9A184 184 0 0 0 395.72 375.73Z" fill="{{g4.fill}}" stroke="{{g4.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M331.18 456.36A214 214 0 0 1 300.42 465.34L299.63 434.75A184 184 0 0 0 315.39 430.15Z" fill="{{g5.fill}}" stroke="{{g5.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M222.45 467.35A214 214 0 0 1 187.76 458.83L202.64 432.09A184 184 0 0 0 221.66 436.77Z" fill="{{g6.fill}}" stroke="{{g6.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M119.6 420.9A214 214 0 0 1 94.07 395.91L120.48 380.46A184 184 0 0 0 134.48 394.16Z" fill="{{g7.fill}}" stroke="{{g7.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M54.69 328.59A214 214 0 0 1 46.1 297.71L76.7 297.32A184 184 0 0 0 81.1 313.14Z" fill="{{g8.fill}}" stroke="{{g8.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M45.1 219.72A214 214 0 0 1 54.07 185.15L80.61 200.37A184 184 0 0 0 75.69 219.32Z" fill="{{g9.fill}}" stroke="{{g9.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M92.88 117.48A214 214 0 0 1 115.39 94.68L130.95 121.02A184 184 0 0 0 119.42 132.71Z" fill="{{g10.fill}}" stroke="{{g10.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M182.54 55A214 214 0 0 1 217 45.58L217 76.18A184 184 0 0 0 198.11 81.34Z" fill="{{g11.fill}}" stroke="{{g11.fill}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M295 45.58A214 214 0 0 1 329.46 55L313.89 81.34A184 184 0 0 0 295 76.18Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M295 45.58A214 214 0 0 1 329.46 55L313.89 81.34A184 184 0 0 0 295 76.18Z" fill="none" stroke="{{g0.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M396.61 94.68A214 214 0 0 1 414.26 111.95L388.26 128.08A184 184 0 0 0 381.05 121.02Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M396.61 94.68A214 214 0 0 1 414.26 111.95L388.26 128.08A184 184 0 0 0 381.05 121.02Z" fill="none" stroke="{{g1.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M455.37 178.24A214 214 0 0 1 465.53 212.48L434.94 213.14A184 184 0 0 0 429.37 194.36Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M455.37 178.24A214 214 0 0 1 465.53 212.48L434.94 213.14A184 184 0 0 0 429.37 194.36Z" fill="none" stroke="{{g2.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M467.21 290.46A214 214 0 0 1 459.69 321.62L432.77 307.08A184 184 0 0 0 436.62 291.12Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M467.21 290.46A214 214 0 0 1 459.69 321.62L432.77 307.08A184 184 0 0 0 436.62 291.12Z" fill="none" stroke="{{g3.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M422.65 390.26A214 214 0 0 1 397.99 416.11L382.2 389.9A184 184 0 0 0 395.72 375.73Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M422.65 390.26A214 214 0 0 1 397.99 416.11L382.2 389.9A184 184 0 0 0 395.72 375.73Z" fill="none" stroke="{{g4.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M331.18 456.36A214 214 0 0 1 300.42 465.34L299.63 434.75A184 184 0 0 0 315.39 430.15Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M331.18 456.36A214 214 0 0 1 300.42 465.34L299.63 434.75A184 184 0 0 0 315.39 430.15Z" fill="none" stroke="{{g5.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M222.45 467.35A214 214 0 0 1 187.76 458.83L202.64 432.09A184 184 0 0 0 221.66 436.77Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M222.45 467.35A214 214 0 0 1 187.76 458.83L202.64 432.09A184 184 0 0 0 221.66 436.77Z" fill="none" stroke="{{g6.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M119.6 420.9A214 214 0 0 1 94.07 395.91L120.48 380.46A184 184 0 0 0 134.48 394.16Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M119.6 420.9A214 214 0 0 1 94.07 395.91L120.48 380.46A184 184 0 0 0 134.48 394.16Z" fill="none" stroke="{{g7.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M54.69 328.59A214 214 0 0 1 46.1 297.71L76.7 297.32A184 184 0 0 0 81.1 313.14Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M54.69 328.59A214 214 0 0 1 46.1 297.71L76.7 297.32A184 184 0 0 0 81.1 313.14Z" fill="none" stroke="{{g8.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M45.1 219.72A214 214 0 0 1 54.07 185.15L80.61 200.37A184 184 0 0 0 75.69 219.32Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M45.1 219.72A214 214 0 0 1 54.07 185.15L80.61 200.37A184 184 0 0 0 75.69 219.32Z" fill="none" stroke="{{g9.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M92.88 117.48A214 214 0 0 1 115.39 94.68L130.95 121.02A184 184 0 0 0 119.42 132.71Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M92.88 117.48A214 214 0 0 1 115.39 94.68L130.95 121.02A184 184 0 0 0 119.42 132.71Z" fill="none" stroke="{{g10.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<path d="M182.54 55A214 214 0 0 1 217 45.58L217 76.18A184 184 0 0 0 198.11 81.34Z" fill="none" stroke="{{c.ink}}" stroke-opacity="{{hcEdgeO}}" stroke-width="64" stroke-linejoin="round">
</path>
<path d="M182.54 55A214 214 0 0 1 217 45.58L217 76.18A184 184 0 0 0 198.11 81.34Z" fill="none" stroke="{{g11.fill}}" stroke-opacity="{{hcEdgeO}}" stroke-width="58" stroke-linejoin="round">
</path>
<g class="mo">
<g visibility="{{g0.vis}}" pointer-events="none">
<path d="M305.04 76.58L323.65 57.82L298.57 50.97Z" fill="{{g0.onFill}}" stroke="{{g0.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M305.04 76.58L323.65 57.82L298.57 50.97Z" fill="{{g0.onFill}}" stroke="{{g0.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette January" aria-pressed="{{g0.pressed}}" data-picker-month="0" d="M295 45.58A214 214 0 0 1 329.46 55L313.89 81.34A184 184 0 0 0 295 76.18Z" stroke-width="64" stroke-linejoin="round">
<title>January</title>
</path>
</g>
<g class="mo">
<g visibility="{{g1.vis}}" pointer-events="none">
<path d="M386.1 123.07L411.48 115.73L392.9 97.54Z" fill="{{g1.onFill}}" stroke="{{g1.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M386.1 123.07L411.48 115.73L392.9 97.54Z" fill="{{g1.onFill}}" stroke="{{g1.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette February" aria-pressed="{{g1.pressed}}" data-picker-month="1" d="M396.61 94.68A214 214 0 0 1 414.26 111.95L388.26 128.08A184 184 0 0 0 381.05 121.02Z" stroke-width="64" stroke-linejoin="round">
<title>February</title>
</path>
</g>
<g class="mo">
<g visibility="{{g2.vis}}" pointer-events="none">
<path d="M434.32 203.11L460.07 209.03L452.68 184.11Z" fill="{{g2.onFill}}" stroke="{{g2.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M434.32 203.11L460.07 209.03L452.68 184.11Z" fill="{{g2.onFill}}" stroke="{{g2.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette March" aria-pressed="{{g2.pressed}}" data-picker-month="2" d="M455.37 178.24A214 214 0 0 1 465.53 212.48L434.94 213.14A184 184 0 0 0 429.37 194.36Z" stroke-width="64" stroke-linejoin="round">
<title>March</title>
</path>
</g>
<g class="mo">
<g visibility="{{g3.vis}}" pointer-events="none">
<path d="M436.81 299.62L456.12 317.65L462.22 292.37Z" fill="{{g3.onFill}}" stroke="{{g3.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M436.81 299.62L456.12 317.65L462.22 292.37Z" fill="{{g3.onFill}}" stroke="{{g3.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette April" aria-pressed="{{g3.pressed}}" data-picker-month="3" d="M467.21 290.46A214 214 0 0 1 459.69 321.62L432.77 307.08A184 184 0 0 0 436.62 291.12Z" stroke-width="64" stroke-linejoin="round">
<title>April</title>
</path>
</g>
<g class="mo">
<g visibility="{{g4.vis}}" pointer-events="none">
<path d="M390.6 384.37L398.27 409.65L416.21 390.84Z" fill="{{g4.onFill}}" stroke="{{g4.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M390.6 384.37L398.27 409.65L416.21 390.84Z" fill="{{g4.onFill}}" stroke="{{g4.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette May" aria-pressed="{{g4.pressed}}" data-picker-month="4" d="M422.65 390.26A214 214 0 0 1 397.99 416.11L382.2 389.9A184 184 0 0 0 395.72 375.73Z" stroke-width="64" stroke-linejoin="round">
<title>May</title>
</path>
</g>
<g class="mo">
<g visibility="{{g5.vis}}" pointer-events="none">
<path d="M308.12 434.55L302.09 460.27L327.05 452.98Z" fill="{{g5.onFill}}" stroke="{{g5.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M308.12 434.55L302.09 460.27L327.05 452.98Z" fill="{{g5.onFill}}" stroke="{{g5.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette June" aria-pressed="{{g5.pressed}}" data-picker-month="5" d="M331.18 456.36A214 214 0 0 1 300.42 465.34L299.63 434.75A184 184 0 0 0 315.39 430.15Z" stroke-width="64" stroke-linejoin="round">
<title>June</title>
</path>
</g>
<g class="mo">
<g visibility="{{g6.vis}}" pointer-events="none">
<path d="M211.61 436.62L193.49 455.86L218.74 462.06Z" fill="{{g6.onFill}}" stroke="{{g6.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M211.61 436.62L193.49 455.86L218.74 462.06Z" fill="{{g6.onFill}}" stroke="{{g6.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette July" aria-pressed="{{g6.pressed}}" data-picker-month="6" d="M222.45 467.35A214 214 0 0 1 187.76 458.83L202.64 432.09A184 184 0 0 0 221.66 436.77Z" stroke-width="64" stroke-linejoin="round">
<title>July</title>
</path>
</g>
<g class="mo">
<g visibility="{{g7.vis}}" pointer-events="none">
<path d="M125.9 388.93L100.52 396.27L119.1 414.46Z" fill="{{g7.onFill}}" stroke="{{g7.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M125.9 388.93L100.52 396.27L119.1 414.46Z" fill="{{g7.onFill}}" stroke="{{g7.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette August" aria-pressed="{{g7.pressed}}" data-picker-month="7" d="M119.6 420.9A214 214 0 0 1 94.07 395.91L120.48 380.46A184 184 0 0 0 134.48 394.16Z" stroke-width="64" stroke-linejoin="round">
<title>August</title>
</path>
</g>
<g class="mo">
<g visibility="{{g8.vis}}" pointer-events="none">
<path d="M76.79 305.81L51.15 299.45L58.12 324.5Z" fill="{{g8.onFill}}" stroke="{{g8.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M76.79 305.81L51.15 299.45L58.12 324.5Z" fill="{{g8.onFill}}" stroke="{{g8.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette September" aria-pressed="{{g8.pressed}}" data-picker-month="8" d="M54.69 328.59A214 214 0 0 1 46.1 297.71L76.7 297.32A184 184 0 0 0 81.1 313.14Z" stroke-width="64" stroke-linejoin="round">
<title>September</title>
</path>
</g>
<g class="mo">
<g visibility="{{g9.vis}}" pointer-events="none">
<path d="M75.96 209.28L56.97 190.92L50.44 216.08Z" fill="{{g9.onFill}}" stroke="{{g9.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M75.96 209.28L56.97 190.92L50.44 216.08Z" fill="{{g9.onFill}}" stroke="{{g9.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette October" aria-pressed="{{g9.pressed}}" data-picker-month="9" d="M45.1 219.72A214 214 0 0 1 54.07 185.15L80.61 200.37A184 184 0 0 0 75.69 219.32Z" stroke-width="64" stroke-linejoin="round">
<title>October</title>
</path>
</g>
<g class="mo">
<g visibility="{{g10.vis}}" pointer-events="none">
<path d="M123.63 125.33L116.4 99.92L98.13 118.42Z" fill="{{g10.onFill}}" stroke="{{g10.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M123.63 125.33L116.4 99.92L98.13 118.42Z" fill="{{g10.onFill}}" stroke="{{g10.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette November" aria-pressed="{{g10.pressed}}" data-picker-month="10" d="M92.88 117.48A214 214 0 0 1 115.39 94.68L130.95 121.02A184 184 0 0 0 119.42 132.71Z" stroke-width="64" stroke-linejoin="round">
<title>November</title>
</path>
</g>
<g class="mo">
<g visibility="{{g11.vis}}" pointer-events="none">
<path d="M206.96 76.58L213.43 50.97L188.35 57.82Z" fill="{{g11.onFill}}" stroke="{{g11.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M206.96 76.58L213.43 50.97L188.35 57.82Z" fill="{{g11.onFill}}" stroke="{{g11.onFill}}" stroke-width="4" stroke-linejoin="round">
</path>
</g>
<path class="dh" role="button" tabindex="0" aria-label="Palette December" aria-pressed="{{g11.pressed}}" data-picker-month="11" d="M182.54 55A214 214 0 0 1 217 45.58L217 76.18A184 184 0 0 0 198.11 81.34Z" stroke-width="64" stroke-linejoin="round">
<title>December</title>
</path>
</g>
<circle cx="256" cy="256" r="124" fill="{{disc.dark.bg}}">
</circle>
<path d="M301.27 151.38A114 114 0 0 0 210.73 360.62Z" fill="{{disc.light.bg}}">
</path>
<path d="M280.62 199.1A62 62 0 0 0 231.38 312.9Z" fill="{{disc.hcLight.text}}">
</path>
<path d="M277.84 205.52A55 55 0 0 0 234.16 306.48Z" fill="{{disc.hcLight.bg}}">
</path>
<path d="M231.38 312.9A62 62 0 0 0 280.62 199.1Z" fill="{{disc.hcDark.text}}">
</path>
<path d="M234.16 306.48A55 55 0 0 0 277.84 205.52Z" fill="{{disc.hcDark.bg}}">
</path>
<circle cx="256" cy="256" r="125.5" fill="none" stroke="{{c.ink}}" stroke-opacity="{{discEdgeO}}" stroke-width="5" pointer-events="none">
</circle>
<g class="zo">
<g visibility="{{z0.vis}}" pointer-events="none">
<path d="M215.93 185.43L194.82 172.58L215.69 160.73Z" fill="{{z0.fg}}" stroke="{{z0.fg}}" stroke-width="3" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M215.93 185.43L194.82 172.58L215.69 160.73Z" fill="{{z0.fg}}" stroke="{{z0.fg}}" stroke-width="3" stroke-linejoin="round">
</path>
</g>
<path class="dz" role="button" tabindex="0" aria-label="Theme Light" aria-pressed="{{z0.pressed}}" data-picker-mode="light" d="M305.25 142.2A124 124 0 0 0 206.75 369.8ZM280.62 199.1A62 62 0 0 0 231.38 312.9Z" fill-rule="evenodd">
<title>Light · Outer left</title>
</path>
</g>
<g class="zo">
<g visibility="{{z1.vis}}" pointer-events="none">
<path d="M294.27 326.46L315.13 339.71L294.04 351.16Z" fill="{{z1.fg}}" stroke="{{z1.fg}}" stroke-width="3" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M294.27 326.46L315.13 339.71L294.04 351.16Z" fill="{{z1.fg}}" stroke="{{z1.fg}}" stroke-width="3" stroke-linejoin="round">
</path>
</g>
<path class="dz" role="button" tabindex="0" aria-label="Theme Dark" aria-pressed="{{z1.pressed}}" data-picker-mode="dark" d="M206.75 369.8A124 124 0 0 0 305.25 142.2ZM231.38 312.9A62 62 0 0 0 280.62 199.1Z" fill-rule="evenodd">
<title>Dark · Outer right</title>
</path>
</g>
<g class="zo">
<g visibility="{{z2.vis}}" pointer-events="none">
<path d="M235.58 246.92L220.81 248.24L226.66 235.08Z" fill="{{z2.fg}}" stroke="{{z2.fg}}" stroke-width="1.8" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M235.58 246.92L220.81 248.24L226.66 235.08Z" fill="{{z2.fg}}" stroke="{{z2.fg}}" stroke-width="1.8" stroke-linejoin="round">
</path>
</g>
<path class="dz" role="button" tabindex="0" aria-label="Theme High Contrast Light" aria-pressed="{{z2.pressed}}" data-picker-mode="hcLight" d="M280.62 199.1A62 62 0 0 0 231.38 312.9Z">
<title>High Contrast Light · Core left</title>
</path>
</g>
<g class="zo">
<g visibility="{{z3.vis}}" pointer-events="none">
<path d="M276.42 265.08L291.19 263.76L285.34 276.92Z" fill="{{z3.fg}}" stroke="{{z3.fg}}" stroke-width="1.8" stroke-linejoin="round">
</path>
</g>
<g class="dec" pointer-events="none">
<path class="mk" d="M276.42 265.08L291.19 263.76L285.34 276.92Z" fill="{{z3.fg}}" stroke="{{z3.fg}}" stroke-width="1.8" stroke-linejoin="round">
</path>
</g>
<path class="dz" role="button" tabindex="0" aria-label="Theme High Contrast" aria-pressed="{{z3.pressed}}" data-picker-mode="hcDark" d="M231.38 312.9A62 62 0 0 0 280.62 199.1Z">
<title>High Contrast · Core right</title>
</path>
</g>`;

const WIDE_LABELS = `<g pointer-events="none">
<path d="M-12 160Q68.4 220 152.11 209.91" fill="none" stroke="{{c.panel}}" stroke-width="8" stroke-linecap="round">
</path>
<path d="M-12 160Q68.4 220 152.11 209.91" fill="none" stroke="{{c.ink}}" stroke-width="3" stroke-linecap="round">
</path>
<path d="M168 208L153.19 218.85L151.04 200.98Z" fill="{{c.ink}}" stroke="{{c.panel}}" stroke-width="2.5" stroke-linejoin="round" paint-order="stroke">
</path>
<path d="M-12 340Q114.4 348.8 199.68 278.2" fill="none" stroke="{{c.panel}}" stroke-width="8" stroke-linecap="round">
</path>
<path d="M-12 340Q114.4 348.8 199.68 278.2" fill="none" stroke="{{c.ink}}" stroke-width="3" stroke-linecap="round">
</path>
<path d="M212 268L205.41 285.14L193.94 271.27Z" fill="{{c.ink}}" stroke="{{c.panel}}" stroke-width="2.5" stroke-linejoin="round" paint-order="stroke">
</path>
<path d="M524 160Q443.6 220 359.89 209.91" fill="none" stroke="{{c.panel}}" stroke-width="8" stroke-linecap="round">
</path>
<path d="M524 160Q443.6 220 359.89 209.91" fill="none" stroke="{{c.ink}}" stroke-width="3" stroke-linecap="round">
</path>
<path d="M344 208L360.96 200.98L358.81 218.85Z" fill="{{c.ink}}" stroke="{{c.panel}}" stroke-width="2.5" stroke-linejoin="round" paint-order="stroke">
</path>
<path d="M524 340Q392.8 336.8 311.31 255.31" fill="none" stroke="{{c.panel}}" stroke-width="8" stroke-linecap="round">
</path>
<path d="M524 340Q392.8 336.8 311.31 255.31" fill="none" stroke="{{c.ink}}" stroke-width="3" stroke-linecap="round">
</path>
<path d="M300 244L317.68 248.95L304.95 261.68Z" fill="{{c.ink}}" stroke="{{c.panel}}" stroke-width="2.5" stroke-linejoin="round" paint-order="stroke">
</path>
<text x="-24" y="170" text-anchor="end" font-size="32" font-weight="{{fd.w}}" font-family="{{fd.fam}}" letter-spacing="-.3" fill="{{c.ink}}">
<tspan x="-24" dy="0">Light</tspan>
</text>
<text x="-24" y="202" text-anchor="end" font-size="19" letter-spacing="2.2" font-family="JetBrains Mono, ui-monospace, monospace" fill="{{c.muted}}">OUTER LEFT</text>
<text x="-24" y="350" text-anchor="end" font-size="32" font-weight="{{fd.w}}" font-family="{{fd.fam}}" letter-spacing="-.3" fill="{{c.ink}}">
<tspan x="-24" dy="0">High Contrast</tspan>
<tspan x="-24" dy="34">Light</tspan>
</text>
<text x="-24" y="416" text-anchor="end" font-size="19" letter-spacing="2.2" font-family="JetBrains Mono, ui-monospace, monospace" fill="{{c.muted}}">CORE LEFT</text>
<text x="536" y="170" text-anchor="start" font-size="32" font-weight="{{fd.w}}" font-family="{{fd.fam}}" letter-spacing="-.3" fill="{{c.ink}}">
<tspan x="536" dy="0">Dark</tspan>
</text>
<text x="536" y="202" text-anchor="start" font-size="19" letter-spacing="2.2" font-family="JetBrains Mono, ui-monospace, monospace" fill="{{c.muted}}">OUTER RIGHT</text>
<text x="536" y="350" text-anchor="start" font-size="32" font-weight="{{fd.w}}" font-family="{{fd.fam}}" letter-spacing="-.3" fill="{{c.ink}}">
<tspan x="536" dy="0">High Contrast</tspan>
</text>
<text x="536" y="382" text-anchor="start" font-size="19" letter-spacing="2.2" font-family="JetBrains Mono, ui-monospace, monospace" fill="{{c.muted}}">CORE RIGHT</text>
</g>`;

const MODES = ['light', 'dark', 'hcLight', 'hcDark'];
function luminance(hex) {
  let color = hex.replace('#', '');
  if (color.length === 3) color = color.split('').map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const v = parseInt(color.slice(offset, offset + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Mount the reference logo control once. update() changes bound attributes in place,
 * keeping the focused SVG control alive after every month or variant selection.
 * @param {Element} container
 * @param {Array} months Twelve entries with light/dark/hcLight/hcDark page palettes.
 * @param {Function} onChange Receives { month: 0..11 } or { mode: string }.
 * @returns {{update: Function}}
 */
export function createPicker(container, months, onChange) {
  if (months.length !== 12) throw new Error('The logo picker requires twelve months.');
  const label = 'Logo: twelve months around a disc of four themes. Choose a month on the ring, a theme on the disc.';
  container.innerHTML = `
    <svg class="pk pk-wide" viewBox="-300 -12 1112 544" width="100%" style="display:block; height:auto; color:{{c.ink}}" role="group" aria-label="${label}">${ARTWORK}${WIDE_LABELS}</svg>
    <svg class="pk pk-compact" viewBox="-12 -12 536 536" width="100%" style="height:auto; max-width:480px; margin:0 auto; color:{{c.ink}}" role="group" aria-label="${label}">${ARTWORK}</svg>`;

  const bindings = [];
  for (const node of container.querySelectorAll('*')) {
    for (const attribute of Array.from(node.attributes)) {
      if (attribute.value.includes('{{')) {
        bindings.push({ node, name: attribute.name, template: attribute.value });
      }
    }
  }
  for (const control of container.querySelectorAll('[data-picker-month], [data-picker-mode]')) {
    const choose = () => {
      if (control.hasAttribute('data-picker-month')) {
        onChange({ month: Number(control.getAttribute('data-picker-month')) });
      } else {
        onChange({ mode: control.getAttribute('data-picker-mode') });
      }
    };
    control.addEventListener('click', choose);
    control.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose();
      }
    });
  }

  function update(monthIndex, mode) {
    const month = Number.isInteger(monthIndex) && monthIndex >= 0 && monthIndex < 12 ? monthIndex : 0;
    const variant = MODES.includes(mode) ? mode : 'light';
    const palette = months[month][variant];
    const panelLuminance = luminance(palette.panel);
    const mutedLuminance = luminance(palette.muted);
    const labelContrast = (Math.max(panelLuminance, mutedLuminance) + 0.05) / (Math.min(panelLuminance, mutedLuminance) + 0.05);
    const values = {
      c: { ink: palette.text, muted: labelContrast >= 4.5 ? palette.muted : palette.text, panel: palette.panel },
      fd: { fam: "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace", w: '700' },
      hcEdgeO: variant === 'hcLight' || variant === 'hcDark' ? '1' : '0',
      discEdgeO: variant === 'hcLight' || variant === 'hcDark' ? '1' : '0.4',
      disc: Object.fromEntries(MODES.map((key) => [key, { bg: months[month][key].bg, text: months[month][key].text }])),
    };
    for (let i = 0; i < 12; i++) {
      const source = months[i][variant];
      const fill = source.accent;
      values['g' + i] = {
        vis: i === month ? 'visible' : 'hidden',
        pressed: String(i === month),
        fill,
        onFill: source.onAccent,
      };
    }
    MODES.forEach((key, i) => {
      values['z' + i] = { vis: key === variant ? 'visible' : 'hidden', pressed: String(key === variant), fg: months[month][key].text };
    });
    for (const binding of bindings) {
      const next = binding.template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
        return key.split('.').reduce((value, part) => value[part], values);
      });
      if (binding.node.getAttribute(binding.name) !== next) binding.node.setAttribute(binding.name, next);
    }
  }
  update(0, 'light');
  return { update };
}
