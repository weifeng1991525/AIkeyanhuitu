"""
MedAI Pro - Case Image Generator
Run this script to generate all 6 case images using gpt-image-2 API.

Usage:
  pip install openai
  python scripts/generate-case-images.py
"""
from openai import OpenAI
import base64
import os
import sys

client = OpenAI(
    api_key="sk-WvlDXFsd7k9Ze7wA9Yckuj0xSbfY6i55Jra0xohSr8isK5QM",
    base_url="https://kuaipao.ai/v1"
)

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'cases')
os.makedirs(OUT, exist_ok=True)

cases = [
    {
        "filename": "hypothesis-circRNA.png",
        "prompt": "Scientific research hypothesis diagram: circRNA regulates miR-456 to modulate PTEN/AKT signaling pathway in colorectal cancer. Show molecular interactions with labeled nodes (circRNA, miR-456, PTEN, AKT, mTOR), directional arrows, and pathway cascades. Clean professional scientific figure, blue and teal color scheme on white background, Nature journal quality, vector illustration style.",
        "size": "3840x2160",
    },
    {
        "filename": "hypothesis-pdl1.png",
        "prompt": "Scientific research hypothesis diagram: PD-1/PD-L1 inhibitor resistance mechanism in non-small cell lung cancer (NSCLC). Show tumor cell, T cell, PD-1/PD-L1 interaction, alternative immune checkpoint pathways (LAG-3, TIM-3, TIGIT), and resistance mechanisms including JAK/STAT signaling. Professional molecular biology illustration, clean style, labeled pathways, blue and amber color scheme, Nature journal quality.",
        "size": "3840x2160",
    },
    {
        "filename": "hypothesis-gutbrain.png",
        "prompt": "Scientific research hypothesis diagram: Gut microbiota regulating depression through the gut-brain axis. Show intestinal barrier, microbiome metabolites (SCFAs, tryptophan), vagus nerve signaling, blood-brain barrier, and brain regions (hippocampus, prefrontal cortex). Include serotonin and dopamine pathways. Professional neuroscience illustration, clean labeled diagram, teal and purple color scheme, Nature journal quality.",
        "size": "3840x2160",
    },
    {
        "filename": "roadmap-circRNA.png",
        "prompt": "Scientific research technical roadmap infographic: circRNA functional study in cancer. Vertical timeline showing 5 phases: 1) Bioinformatics analysis (RNA-seq data mining), 2) In vitro validation (cell culture, qPCR, luciferase assay), 3) Mechanism exploration (RIP, RNA pull-down, FISH), 4) In vivo models (xenograft mice), 5) Clinical correlation (patient samples, IHC). Clean professional infographic style, numbered steps with icons, blue and teal color scheme, vertical layout.",
        "size": "2160x3840",
    },
    {
        "filename": "roadmap-pd1.png",
        "prompt": "Scientific research technical roadmap infographic: Novel PD-1 inhibitor preclinical development. Vertical timeline showing 4 phases: 1) Drug design and synthesis, 2) In vitro screening (binding assay, cell-based assay), 3) In vivo efficacy (tumor models, pharmacokinetics), 4) Toxicology and IND filing. Clean professional infographic with icons, numbered steps, amber and blue color scheme, vertical layout, pharmaceutical research style.",
        "size": "2160x3840",
    },
    {
        "filename": "roadmap-singlecell.png",
        "prompt": "Scientific research technical roadmap infographic: Single-cell sequencing to analyze tumor microenvironment. Vertical timeline showing 4 phases: 1) Sample preparation (tissue dissociation, quality control), 2) scRNA-seq experiment (10x Genomics, library prep), 3) Bioinformatics analysis (Seurat, cell clustering, trajectory), 4) Validation and functional assays (flow cytometry, spatial transcriptomics). Clean professional infographic, numbered steps with icons, rose and teal color scheme, vertical layout.",
        "size": "2160x3840",
    },
]

print(f"Generating {len(cases)} case images...")
for i, case in enumerate(cases):
    print(f"\n[{i+1}/{len(cases)}] {case['filename']}...")
    try:
        result = client.images.generate(
            model="gpt-image-2",
            prompt=case["prompt"],
            size=case["size"],
            quality="high",
            n=1,
        )
        image_base64 = result.data[0].b64_json
        filepath = os.path.join(OUT, case["filename"])
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_base64))
        print(f"  OK: {filepath} ({os.path.getsize(filepath)//1024}KB)")
    except Exception as e:
        print(f"  ERROR: {e}")

print("\nDone!")
