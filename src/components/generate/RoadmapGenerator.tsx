'use client';

import React, { useState } from 'react';
import { RoadmapFormData } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import {
  Map,
  Sparkles,
  Clock,
  CheckCircle2,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface RoadmapGeneratorProps {
  onSubmit: (data: RoadmapFormData) => Promise<void>;
  isLoading?: boolean;
  result?: {
    roadmap: string;
    phases: Array<{ phase: string; tasks: string[]; duration: string }>;
  } | null;
}

interface ExampleCase {
  id: string;
  title: string;
  description: string;
  content: string;
  mockResult: {
    roadmap: string;
    phases: Array<{ phase: string; tasks: string[]; duration: string }>;
  };
}

const exampleCases: ExampleCase[] = [
  {
    id: 'case1',
    title: 'circRNA在肿瘤中的功能研究技术路线',
    description:
      '从生物信息学筛选到体内外功能验证的完整circRNA功能研究技术路线，涵盖分子机制解析全过程。',
    content:
      '研究circRNA_00123在结直肠癌中的功能，从生物信息学分析到体内验证：通过GEO和TCGA数据库筛选差异表达circRNA，qRT-PCR验证组织及细胞系表达，功能实验（CCK-8、Transwell、流式凋亡），机制研究（荧光素酶报告基因、RIP、FISH），裸鼠皮下成瘤及肺转移模型验证。',
    mockResult: {
      roadmap:
        '本研究采用"筛选-验证-功能-机制-体内"五步递进策略，从生物信息学大数据挖掘出发，逐步聚焦到circRNA_00123的体内外功能与ceRNA分子机制，最终在动物模型中验证其抑癌作用，为结直肠癌的circRNA靶向治疗提供实验依据。总周期预计18个月。',
      phases: [
        {
          phase: '第一阶段：生物信息学筛选与表达验证',
          duration: '第1-3个月',
          tasks: [
            'GEO（GSE126092、GSE89657）和TCGA-COAD差异circRNA分析',
            'circRNA-miRNA-mRNA ceRNA网络构建（Cytoscape可视化）',
            '收集50对结直肠癌及癌旁组织，qRT-PCR验证top5候选circRNA',
            '细胞系（HCT116、SW480、HT29、NCM460）表达谱验证',
            '锁定目标circRNA_00123进入后续研究',
          ],
        },
        {
          phase: '第二阶段：体外功能实验',
          duration: '第4-7个月',
          tasks: [
            'circRNA_00123过表达载体（pCD5-ciR）及siRNA敲低构建',
            'CCK-8和EdU检测细胞增殖能力',
            'Transwell和划痕实验检测迁移与侵袭',
            '流式细胞术检测细胞周期分布与凋亡',
            'Western blot检测增殖/凋亡相关蛋白（Cyclin D1, Bcl-2, Bax）',
          ],
        },
        {
          phase: '第三阶段：ceRNA分子机制解析',
          duration: '第8-12个月',
          tasks: [
            'circInteractome和starBase预测circRNA_00123结合miRNA',
            'RNA pull-down + qRT-PCR验证miR-456结合',
            '双荧光素酶报告基因验证miR-456与PTEN 3\'UTR结合',
            'RIP实验验证Ago2介导的circRNA_00123/miR-456/PTEN复合体',
            'FISH共定位检测circRNA_00123与miR-456亚细胞分布',
            'Western blot验证PTEN及PI3K/AKT通路蛋白变化',
          ],
        },
        {
          phase: '第四阶段：体内动物实验验证',
          duration: '第13-16个月',
          tasks: [
            '构建circRNA_00123稳定过表达/敲低的HCT116细胞系',
            '裸鼠皮下成瘤模型：测量肿瘤体积和重量（每周2次）',
            '裸鼠尾静脉注射肺转移模型：HE染色计数肺转移灶',
            '免疫组化（IHC）检测肿瘤组织Ki-67、PTEN、p-AKT表达',
            '外泌体提取与示踪：验证circRNA_00123的旁分泌传递',
          ],
        },
        {
          phase: '第五阶段：数据整理与论文撰写',
          duration: '第17-18个月',
          tasks: [
            '全部实验数据统计学分析（GraphPad Prism 9）',
            '主图（Figure 1-6）及补充材料整理',
            'SCI论文撰写（目标期刊：Molecular Cancer, IF~7）',
            '投稿前预审与修改',
          ],
        },
      ],
    },
  },
  {
    id: 'case2',
    title: '新型PD-1抑制剂临床前研究路线',
    description:
      '新型PD-1/PD-L1小分子抑制剂的药物发现、体外活性评价与体内药效学研究技术路线。',
    content:
      '新型PD-1抑制剂临床前研究路线：基于PD-1/PD-L1晶体结构进行虚拟筛选，获得先导化合物后进行体外结合活性（SPR、ELISA）和细胞功能实验（T细胞激活、肿瘤细胞杀伤），随后开展PK/PD研究及人源化小鼠肿瘤模型药效评价，最终完成IND-enabling毒理学研究。',
    mockResult: {
      roadmap:
        '本研究遵循"药物发现-体外评价-体内验证-安全性评价"的新药临床前研究范式，从结构生物学出发，通过虚拟筛选获得PD-1/PD-L1小分子抑制剂先导化合物，经系统的体内外药效学评价和初步安全性评估，为IND申报奠定基础。总周期预计24个月。',
      phases: [
        {
          phase: '第一阶段：先导化合物发现与优化',
          duration: '第1-6个月',
          tasks: [
            'PD-1/PD-L1复合物晶体结构分析（PDB: 4ZQK）',
            'Schrödinger Glide虚拟筛选（ZINC15数据库，约200万化合物）',
            '分子动力学模拟（GROMACS）评估结合稳定性',
            'Top 100化合物SPR（Biacore）结合动力学测定',
            '先导化合物构效关系（SAR）优化与成药性评估（Lipinski规则）',
          ],
        },
        {
          phase: '第二阶段：体外活性评价',
          duration: '第7-12个月',
          tasks: [
            'PD-1/PD-L1阻断ELISA实验（IC50测定）',
            'Jurkat-NFAT报告基因T细胞激活实验',
            '人PBMC体外共培养：CD8+ T细胞杀伤肿瘤细胞实验',
            '多重细胞因子检测（IL-2, IFN-gamma, TNF-alpha）',
            '选择性评价：PD-1/PD-L2, CTLA-4等旁系检查点',
          ],
        },
        {
          phase: '第三阶段：体内药效学研究',
          duration: '第13-18个月',
          tasks: [
            '小鼠PK研究：iv/po给药后血药浓度-时间曲线（LC-MS/MS）',
            'PD标志物：给药后肿瘤组织p-STAT3、Granzyme B变化',
            'MC38同基因移植瘤模型药效评价（C57BL/6小鼠）',
            '人源化PBMC小鼠模型药效验证',
            '联合用药探索：先导化合物 + 化疗/抗血管生成药物',
          ],
        },
        {
          phase: '第四阶段：IND-enabling研究',
          duration: '第19-24个月',
          tasks: [
            'hERG钾通道心脏安全性评价',
            'CYP450酶抑制与诱导实验',
            '大鼠28天重复给药毒性试验',
            'Genotoxicity: Ames试验 + 微核试验',
            'CMC工艺开发：原料药合成路线优化与制剂处方筛选',
            '撰写Pre-IND会议资料',
          ],
        },
      ],
    },
  },
  {
    id: 'case3',
    title: '单细胞测序解析肿瘤微环境研究方案',
    description:
      '利用单细胞RNA测序和空间转录组学技术系统解析肿瘤微环境异质性与免疫细胞状态的研究方案。',
    content:
      '单细胞测序解析肿瘤微环境研究方案：收集非小细胞肺癌患者手术切除肿瘤组织及配对外周血，进行scRNA-seq（10x Genomics）和空间转录组（Visium）检测，分析肿瘤细胞异质性、免疫细胞亚群（T细胞耗竭谱系、TAM极化状态）、细胞间通讯网络，并验证关键靶点的治疗潜力。',
    mockResult: {
      roadmap:
        '本研究整合scRNA-seq和空间转录组学双平台技术，系统解析NSCLC肿瘤微环境的细胞组成、状态转换和空间分布特征，重点聚焦免疫细胞耗竭与肿瘤细胞上皮-间质转化（EMT）的空间互作关系，为精准免疫治疗策略提供单细胞水平的证据。总周期预计15个月。',
      phases: [
        {
          phase: '第一阶段：样本采集与单细胞测序',
          duration: '第1-4个月',
          tasks: [
            '入组30例NSCLC患者（含10例配对外周血），收集肿瘤/癌旁/外周血样本',
            '组织解离与单细胞悬液制备（ viability > 85%）',
            '10x Genomics Chromium scRNA-seq建库与测序（目标5000 cells/sample）',
            '10x Genomics Visium空间转录组切片与测序',
            'Bulk RNA-seq作为对照验证',
          ],
        },
        {
          phase: '第二阶段：生物信息学分析',
          duration: '第5-9个月',
          tasks: [
            'CellRanger + Seurat标准分析流程：质控、降维、聚类、注释',
            '肿瘤细胞克隆进化分析（CopyKAT + InferCNV）',
            'T细胞亚群精细分型：naive/effector/memory/exhausted（TCR-seq整合）',
            '巨噬细胞极化谱分析：M1/M2/M2-like连续状态（Monocle3轨迹推断）',
            '细胞间通讯网络推断（CellChat + NicheNet）',
            '空间转录组与scRNA-seq整合（Seurat v5 anchor + CellTrek）',
          ],
        },
        {
          phase: '第三阶段：实验验证与功能研究',
          duration: '第10-13个月',
          tasks: [
            '多重免疫荧光（mIHC/Opal）验证关键细胞亚群空间分布',
            '流式细胞术验证T细胞耗竭标志物（PD-1/TIM-3/LAG-3）',
            '体外共培养：耗竭T细胞 + TAM对肿瘤细胞增殖的影响',
            'CRISPR-Cas9敲低关键配体基因（如CXCL13），观察免疫微环境重塑',
          ],
        },
        {
          phase: '第四阶段：数据整合与论文撰写',
          duration: '第14-15个月',
          tasks: [
            '多组学数据整合分析（scRNA + spatial + bulk + TCR）',
            '构建NSCLC TME单细胞图谱数据库（交互式Web展示）',
            '主图（Figure 1-7）制作与补充材料整理',
            'SCI论文撰写（目标期刊：Cancer Discovery / Nature Communications）',
          ],
        },
      ],
    },
  },
];

export default function RoadmapGenerator({
  onSubmit,
  isLoading = false,
  result,
}: RoadmapGeneratorProps) {
  const [formData, setFormData] = useState<RoadmapFormData>({
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
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <Map className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-white">
              技术路线图
            </h2>
            <p className="text-sm text-gray-500">
              AI辅助规划科研项目的技术路线与里程碑
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Single textarea input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              研究内容描述 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ content: e.target.value });
                setActiveCaseId(null);
              }}
              placeholder="请输入您的研究内容，例如：研究circRNA_00123在结直肠癌中的功能，从生物信息学分析到体内验证"
              required
              rows={5}
              className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none transition-all duration-200"
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
                        ? 'border-amber-500/40 bg-amber-500/5'
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
                      <span className="flex-shrink-0 text-xs text-amber-400 font-medium flex items-center gap-1 mt-0.5">
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
              生成路线图
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
            <Loading size="lg" text="AI正在规划技术路线..." />
          </div>
        ) : displayResult ? (
          <div className="space-y-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <Badge variant="amber" size="md">
                {activeCaseId ? '案例预览' : '路线图已生成'}
              </Badge>
              <Button variant="ghost" size="sm" leftIcon={<Download size={14} />}>
                导出
              </Button>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                总体概述
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-navy-500/50 p-4 rounded-lg border border-white/5">
                {displayResult.roadmap}
              </p>
            </div>

            {/* Roadmap Diagram */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                路线图示
              </h3>
              <div className="bg-navy-500/50 border border-white/5 rounded-lg p-6">
                {activeCaseId === 'case1' && (
                  <img src="/images/cases/roadmap-circRNA.png" alt="circRNA技术路线图" className="w-full rounded-lg border border-white/10" />
                )}
                {activeCaseId === 'case2' && (
                  <img src="/images/cases/roadmap-pd1.png" alt="PD-1抑制剂路线图" className="w-full rounded-lg border border-white/10" />
                )}
                {activeCaseId === 'case3' && (
                  <img src="/images/cases/roadmap-singlecell.png" alt="单细胞测序路线图" className="w-full rounded-lg border border-white/10" />
                )}
                {!activeCaseId && displayResult && (
                  <img src="/images/generated/roadmap.png" alt="技术路线图" className="w-full rounded-lg border border-white/10" />
                )}
              </div>
            </div>

            {/* Phases Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                阶段规划
              </h3>
              <div className="space-y-3">
                {displayResult.phases.map((phase, index) => (
                  <div
                    key={index}
                    className="relative pl-8 pb-4 border-l-2 border-amber-500/20 last:border-l-0 last:pb-0"
                  >
                    {/* Phase dot */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-amber-500 rounded-full border-2 border-navy-500" />

                    <div className="bg-navy-500/30 rounded-lg border border-white/5 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-white">
                          {phase.phase}
                        </h4>
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                          <Clock size={12} />
                          {phase.duration}
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {phase.tasks.map((task, taskIndex) => (
                          <li
                            key={taskIndex}
                            className="flex items-start gap-2 text-sm text-gray-400"
                          >
                            <CheckCircle2
                              size={14}
                              className="text-teal-500 mt-0.5 flex-shrink-0"
                            />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="p-4 bg-navy-500/30 rounded-2xl mb-4">
              <Map className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-400 mb-2">
              等待生成
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              描述您的研究内容或选择一个案例，AI将为您规划详细的技术路线与里程碑
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
