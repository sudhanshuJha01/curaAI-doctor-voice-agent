"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { Mic, Clock, FileText, Shield, Zap, Users, Heart, Activity, Stethoscope } from "lucide-react";

export default function HeroSectionOne() {
  const { user } = useUser();
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <nav className="relative z-10 border-b border-pink-100 bg-white bg-opacity-60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Cure<span className="text-pink-600">AI</span>
                </h1>
              </div>
            </Link>
            {!user ? (
              <Link href="/sign-in">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg px-6">
                  Login
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <UserButton />
                <Link href="/dashboard">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg px-4 md:px-6">
                    Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-2 bg-pink-100 border border-pink-200 rounded-full"
          >
            <span className="text-sm font-medium text-pink-700">AI-Powered Medical Assistance</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Instant Medical Guidance,
            <br />
            <span className="text-pink-600">Just a Conversation Away</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Speak naturally with our AI doctor, get real-time transcription, and receive immediate medical guidance with a comprehensive report—all through voice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/dashboard">
              <Button className="w-64 h-12 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg shadow-md">
                <Mic className="w-5 h-5 mr-2" />
                Start Consultation
              </Button>
            </Link>
            <Button variant="outline" className="w-64 h-12 border-2 border-pink-300 text-pink-700 hover:bg-pink-50 text-lg rounded-lg">
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-pink-100 p-2">
              <div className="relative w-full aspect-video bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Voice Consultation Interface</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How CureAI Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our voice-first platform provides end-to-end medical consultation with real-time AI processing
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Voice-First Interface</h3>
              <p className="text-gray-600">
                Simply speak your symptoms naturally. Our advanced speech-to-text technology transcribes your conversation in real-time with high accuracy.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Instant AI Analysis</h3>
              <p className="text-gray-600">
                Our AI doctor processes your symptoms instantly using advanced language models and provides preliminary medical guidance through natural conversation.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Detailed Report</h3>
              <p className="text-gray-600">
                Receive a comprehensive medical report automatically generated at the end, summarizing your consultation, symptoms, and AI recommendations.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose CureAI?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience the future of preliminary medical consultations with cutting-edge AI technology
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-white rounded-xl p-6 border border-pink-100">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-600 text-sm">Access medical guidance anytime, anywhere without appointments</p>
            </div>

            <div className="text-center bg-white rounded-xl p-6 border border-pink-100">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Private & Secure</h3>
              <p className="text-gray-600 text-sm">Your health data is encrypted and protected with enterprise-grade security</p>
            </div>

            <div className="text-center bg-white rounded-xl p-6 border border-pink-100">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Response</h3>
              <p className="text-gray-600 text-sm">Get immediate AI-powered medical insights with low-latency processing</p>
            </div>

            <div className="text-center bg-white rounded-xl p-6 border border-pink-100">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600 text-sm">Natural conversation interface—no medical jargon needed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-20"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-pink-100 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Complete Voice AI Pipeline
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              End-to-end solution from speech to intelligent response
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="px-6 py-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm font-medium text-pink-700">Speech-to-Text</p>
              </div>
              <div className="text-pink-400">→</div>
              <div className="px-6 py-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm font-medium text-pink-700">Large Language Model</p>
              </div>
              <div className="text-pink-400">→</div>
              <div className="px-6 py-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm font-medium text-pink-700">Text-to-Speech</p>
              </div>
              <div className="text-pink-400">→</div>
              <div className="px-6 py-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm font-medium text-pink-700">Medical Report</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 md:p-12 text-center shadow-xl mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Consultation?
          </h2>
          <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
            Experience the future of preliminary medical consultations. Speak with our AI doctor now and get instant guidance.
          </p>
          <Link href="/dashboard">
            <Button className="w-64 h-12 bg-white text-pink-600 hover:bg-pink-50 text-lg rounded-lg shadow-md font-semibold">
              Get Started Free
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center bg-rose-50 rounded-xl p-6 border border-pink-200"
        >
          <p className="text-sm text-gray-600 mb-2">
            <strong className="text-pink-700">Important Disclaimer:</strong> CureAI provides preliminary medical guidance and information only. This is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p className="text-xs text-gray-500">
            Always consult a licensed healthcare professional for medical diagnosis and treatment decisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}