import React from 'react';
import Link from 'next/link';
import { Microscope, Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-500/50 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Microscope className="h-7 w-7 text-teal-500" />
              <span className="text-lg font-display font-bold text-white">
                MedAI Pro
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              基于先进AI技术的医学科研辅助平台，助力研究者高效完成假说构建、
              技术路线规划和科研可视化。让AI成为您的科研伙伴。
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="#"
                className="text-gray-500 hover:text-teal-400 transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-teal-400 transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">产品功能</h4>
            <ul className="space-y-2.5">
              {['假说图生成', '技术路线图', '科研绘图', '数据分析', '文献辅助'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">支持</h4>
            <ul className="space-y-2.5">
              {['使用文档', '常见问题', 'API接口', '联系我们', '隐私政策'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} MedAI Pro. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400" /> for medical research
          </p>
        </div>
      </div>
    </footer>
  );
}
