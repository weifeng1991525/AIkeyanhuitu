'use client';

import React, { useState } from 'react';
import { HypothesisFormData } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import {
  FlaskConical,
  Sparkles,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface HypothesisGeneratorProps {
  onSubmit: (data: HypothesisFormData) => Promise<void>;
  isLoading?: boolean;
  result?: {
    hypothesis: string;
    diagramPrompt: string;
    keyPoints: string[];
  } | null;
}

interface ExampleCase {
  id: string;
  title: string;
  description: string;
  content: string;
  mockResult: {
    hypothesis: string;
    diagramPrompt: string;
    keyPoints: string[];
  };
}

const exampleCases: ExampleCase[] = [
  {
    id: 'case1',
    title: 'circRNA在结直肠癌中的调控机制',
    description:
      '探索circRNA通过ceRNA机制吸附miRNA调控下游靶基因表达，影响结直肠癌增殖与转移的分子通路。',
    content:
      'circRNA在结直肠癌中通过吸附miR-456调控PTEN通路的机制研究：本研究拟通过生物信息学分析筛选结直肠癌差异表达的circRNA，验证circRNA_00123作为ceRNA竞争性结合miR-456，从而解除miR-456对PTEN的靶向抑制，激活PI3K/AKT信号通路，抑制结直肠癌细胞增殖、迁移和侵袭。',
    mockResult: {
      hypothesis:
        'circRNA_00123在结直肠癌中表达显著上调，通过作为ceRNA竞争性结合miR-456，解除其对PTEN 3\'UTR的靶向抑制，导致PTEN蛋白表达升高，进而抑制PI3K/AKT/mTOR信号通路的异常激活，最终抑制结直肠癌细胞的增殖、迁移和侵袭能力。同时，circRNA_00123可能通过外泌体途径在肿瘤微环境中传递，影响免疫细胞功能。',
      diagramPrompt:
        'Scientific mechanism diagram: circRNA_00123 sponges miR-456, releasing PTEN suppression, inhibiting PI3K/AKT/mTOR pathway in colorectal cancer cells. Include nucleus, cytoplasm, exosome secretion.',
      keyPoints: [
        'circRNA_00123在结直肠癌组织中表达显著高于癌旁组织（TCGA+GEO数据挖掘验证）',
        'miR-456直接靶向PTEN 3\'UTR，双荧光素酶报告基因验证结合位点',
        'circRNA_00123通过ceRNA机制竞争性结合miR-456，恢复PTEN蛋白表达',
        'PI3K/AKT/mTOR通路活性在circRNA_00123敲低后显著升高',
        '体内外功能实验证实circRNA_00123抑制CRC增殖、迁移和侵袭',
        '外泌体circRNA_00123可被受体细胞摄取，调控肿瘤微环境',
      ],
    },
  },
  {
    id: 'case2',
    title: 'PD-1/PD-L1抑制剂在非小细胞肺癌中的耐药机制',
    description:
      '研究非小细胞肺癌患者对PD-1/PD-L1免疫检查点抑制剂产生获得性耐药的分子机制及逆转策略。',
    content:
      'PD-1/PD-L1抑制剂在非小细胞肺癌中的耐药机制研究：探讨肿瘤突变负荷（TMB）、WNT/β-catenin信号通路激活、肿瘤微环境中Treg细胞浸润及IFN-γ-JAK-STAT信号通路缺陷等因素在NSCLC免疫治疗耐药中的作用，并筛选潜在的耐药逆转靶点。',
    mockResult: {
      hypothesis:
        'NSCLC对PD-1/PD-L1抑制剂的获得性耐药主要源于三个互作机制：(1) WNT/β-catenin信号通路异常激活导致肿瘤微环境中CD8+ T细胞浸润减少和树突状细胞功能缺陷；(2) JAK1/2功能缺失突变使IFN-γ信号传导受阻，肿瘤细胞逃避T细胞杀伤；(3) Treg细胞通过分泌TGF-β重塑细胞外基质，形成免疫排斥性微环境。联合靶向WNT通路或TGF-β可逆转耐药。',
      diagramPrompt:
        'Mechanism diagram of PD-1/PD-L1 inhibitor resistance in NSCLC: Three parallel pathways - WNT/β-catenin activation, JAK1/2 loss-of-function, Treg/TGF-β immunosuppression - converging on T cell exclusion and immune evasion.',
      keyPoints: [
        'WNT/β-catenin通路激活与"冷肿瘤"表型高度相关（β-catenin核转位阳性率>40%）',
        'JAK1/2失活突变导致IFN-γ信号通路断裂，PD-L1诱导表达失败',
        'TGF-β+ Treg细胞在耐药患者肿瘤微环境中显著富集（流式细胞术验证）',
        '单细胞RNA-seq揭示耐药后CD8+ T细胞耗竭标志物（TIM-3, LAG-3）上调',
        '联合WNT抑制剂（LGK974）或TGF-β抗体可恢复免疫治疗敏感性（PDX模型验证）',
        '外周血ctDNA动态监测可提前预警免疫治疗耐药（中位提前8.3周）',
      ],
    },
  },
  {
    id: 'case3',
    title: '肠道菌群通过肠脑轴调控抑郁症的分子机制',
    description:
      '揭示肠道菌群-肠脑轴在抑郁症发病中的关键作用，聚焦微生物代谢物对神经炎症和神经递质合成的调控。',
    content:
      '肠道菌群通过肠脑轴调控抑郁症的分子机制：研究抑郁症患者肠道菌群紊乱特征，聚焦短链脂肪酸（SCFAs）和色氨酸代谢通路，探讨菌群代谢物通过迷走神经传入和血脑屏障转运影响中枢神经系统5-HT合成及小胶质细胞活化，最终调控抑郁样行为的分子机制。',
    mockResult: {
      hypothesis:
        '抑郁症患者肠道菌群失调导致产SCFA菌（如Faecalibacterium、Roseburia）丰度降低，SCFA（丁酸、丙酸）水平下降，进而通过以下途径诱发抑郁样行为：(1) SCFA减少导致肠屏障通透性增加，LPS入血激活系统炎症，通过血脑屏障促进中枢小胶质细胞M1极化；(2) 色氨酸代谢从5-HT合成途径向犬尿氨酸途径偏移，脑内5-HT合成减少；(3) 迷走神经传入信号减弱，下丘脑-垂体-肾上腺（HPA）轴负反馈失调。粪菌移植可逆转上述异常。',
      diagramPrompt:
        'Gut-brain axis mechanism diagram: Dysbiosis -> reduced SCFA -> increased gut permeability -> LPS translocation -> microglia M1 polarization + tryptophan-kynurenine shift + vagus nerve signaling -> HPA axis dysregulation -> depression.',
      keyPoints: [
        '抑郁症患者粪便中Faecalibacterium prausnitzii丰度降低约60%（16S rRNA测序）',
        '血清丁酸和丙酸水平与HAMD-17评分呈显著负相关（r = -0.62, p < 0.001）',
        '粪菌移植（FMT）后小鼠强迫游泳不动时间缩短45%，蔗糖偏好恢复',
        '脑内小胶质细胞Iba-1/CD86双阳性率在FMT后下降约50%（免疫荧光验证）',
        '色氨酸-犬尿氨酸比值（Kyn/Trp）在FMT组中恢复正常（HPLC检测）',
        '迷走神经切断术可部分阻断FMT的抗抑郁效应，提示体液和神经通路并存',
      ],
    },
  },
];

export default function HypothesisGenerator({
  onSubmit,
  isLoading = false,
  result,
}: HypothesisGeneratorProps) {
  const [formData, setFormData] = useState<HypothesisFormData>({
    content: '',
  });
  const [showExamples, setShowExamples] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  const handleCaseClick = (caseItem: ExampleCase) => {
    setFormData({ content: caseItem.content });
    setActiveCaseId(caseItem.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveCaseId(null);
    await onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({ content: '' });
    setActiveCaseId(null);
  };

  // Determine which result to display
  const activeCase = exampleCases.find((c) => c.id === activeCaseId);
  const displayResult = activeCase ? activeCase.mockResult : result;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card variant="glass" padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-teal-500/10 rounded-xl">
            <FlaskConical className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-white">
              假说图生成
            </h2>
            <p className="text-sm text-gray-500">
              输入研究假说，AI自动生成可视化图示与关键要点
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Single textarea input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              研究假说描述 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ content: e.target.value });
                setActiveCaseId(null);
              }}
              placeholder="请输入您的研究假说，例如：circRNA在结直肠癌中通过吸附miR-456调控PTEN通路的机制研究"
              required
              rows={5}
              className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 resize-none transition-all duration-200"
            />
          </div>

          {/* Example cases collapsible */}
          <div className="border border-white/5 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="w-full flex items-center justify-between px-4 py-3 bg-navy-500/30 hover:bg-navy-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <BookOpen size={16} className="text-amber-400" />
                查看案例
              </div>
              {showExamples ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>

            {showExamples && (
              <div className="p-3 space-y-2 bg-navy-500/20 animate-fade-in">
                {exampleCases.map((caseItem) => (
                  <button
                    key={caseItem.id}
                    type="button"
                    onClick={() => handleCaseClick(caseItem)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      activeCaseId === caseItem.id
                        ? 'border-teal-500/40 bg-teal-500/5'
                        : 'border-white/5 bg-navy-500/30 hover:border-white/10 hover:bg-navy-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white mb-1">
                          {caseItem.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {caseItem.description}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-teal-400 font-medium flex items-center gap-1 mt-0.5">
                        使用此案例
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Sparkles size={16} />}
              className="flex-1"
            >
              生成假说图
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              leftIcon={<RotateCcw size={16} />}
            >
              重置
            </Button>
          </div>
        </form>
      </Card>

      {/* Result Panel */}
      <Card variant="glass" padding="lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loading size="lg" text="AI正在分析研究假说并生成图示..." />
          </div>
        ) : displayResult ? (
          <div className="space-y-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <Badge variant="teal" size="md">
                {activeCaseId ? '案例预览' : '生成完成'}
              </Badge>
              <Button variant="ghost" size="sm" leftIcon={<Download size={14} />}>
                导出
              </Button>
            </div>

            {/* Hypothesis */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                研究假说
              </h3>
              <p className="text-white leading-relaxed bg-navy-500/50 p-4 rounded-lg border border-white/5 text-sm">
                {displayResult.hypothesis}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                关键要点
              </h3>
              <div className="space-y-2">
                {displayResult.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-navy-500/30 rounded-lg border border-white/5"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagram placeholder */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                机制图示
              </h3>
              <div className="bg-navy-500/50 border border-white/5 rounded-lg p-6">
                {activeCaseId === 'case1' && (
                  <img src="/images/cases/hypothesis-circRNA.png" alt="circRNA假说图" className="w-full rounded-lg border border-white/10" />
                )}
                {activeCaseId === 'case2' && (
                  <img src="/images/cases/hypothesis-pdl1.png" alt="PD-L1耐药机制假说图" className="w-full rounded-lg border border-white/10" />
                )}
                {activeCaseId === 'case3' && (
                  <img src="/images/cases/hypothesis-gutbrain.png" alt="肠脑轴假说图" className="w-full rounded-lg border border-white/10" />
                )}
                {!activeCaseId && displayResult && (
                  <img src={displayResult.diagramPrompt ? '/images/generated/hypothesis.png' : '/images/cases/hypothesis-circRNA.png'} alt="假说机制图" className="w-full rounded-lg border border-white/10" />
                )}

                <p className="text-xs text-gray-600 mt-3 text-center font-mono">
                  {displayResult.diagramPrompt}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="p-4 bg-navy-500/30 rounded-2xl mb-4">
              <FlaskConical className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-400 mb-2">
              等待生成
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              输入您的研究假说或选择一个案例，AI将为您生成科学严谨的可视化图示
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
